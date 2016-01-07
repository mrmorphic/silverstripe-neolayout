<?php

/**
 * NLView represents an area on a page or a view which is to provide a component based presentation. It is capable
 * of rendering itself in a template. All you need to give it is the serialised component hierarchy and the context
 * for binding.
 */
class NLView extends Controller {

	// static $allowed_methods = (
	// 	'EditForm'
	// );

	/*
	 * @config
	 */
	private static $layout_manager_class = null;

	protected $layout = null;
	protected $rawComponents;
	protected $context;
	protected $layoutManager;

	static $default_view_contents =
		'{
			"componentType": "NLLayoutContainer",
			"children": [
			],
			"bindings": {
			}
		}';

	// This should really be in the test suite.
	static $default_view_contents_alt2 =
		'{
			"componentType": "NLLayoutContainer",
			"children": [
				{
					"componentType": "NLVerticalBoxLayout",
					"children": [
						{
							"componentType": "NLHorizontalBoxLayout",
							"children": [
								{
									"componentType": "NLLinkComponent",
									"bindings": {
										"ExternalURL": {
											"type": "embedded",
											"value": "http://disney.com"
										}
									},
									"layout": {
										"classes": [ "col-md-4" ]
									},
									"children": [
										{
											"componentType": "NLImageComponent",
											"bindings": {
												"InternalImage": {
													"type": "embedded",
													"value": "Image:1"
												},
												"ResizingOption": {
													"type": "embedded",
													"value": "Resized"
												},
												"Width": {
													"type": "embedded",
													"value": "60"
												},
												"Height": {
													"type": "embedded",
													"value": "40"
												}
											}
										}
									]
								},
								{
									"componentType": "NLTextComponent",
									"bindings": {
										"Text": {
											"type": "embedded",
											"value": "This is some embedded text that should appear to the right of the image."
										}
									},
									"layout": {
										"classes": [ "col-md-8" ]
									}
								}
							]
						},
						{
							"componentType": "NLTextComponent",
							"bindings": {
								"Text": {
									"type": "embedded",
									"value": "Here is some text that should be displayed below the image and other text"
								}
							}
						}
					],
					"bindings": {
					}
				}
			],
			"bindings": {
			}
		}';

	// Helper function that given a serialised form, returns it cleaned. Specifically, if it is not defined, returns
	// the default, and also strips '(' and ')' wrapper if present.
	static function normalise_serialised($serialised) {
		if (!$serialised) {
			$serialised = self::$default_view_contents;
		}
		while (substr($serialised, 0, 1) == '(') {
			$serialised = substr($serialised, 1, -1);	
		}
		return $serialised;
	}

	/** Construct an NLView.
	 * @param $parentController
	 * @param $viewName string
	 * @param $serialised string - Serialised definition of the view contents.
	 * @param $context Object - an object that provides context for bindings of view components, which lets
	 *							components get data from their hosting environment.
	 */
	public function __construct($parentController, $viewName, $serialised, $context, $layoutManager = null) {
		parent::__construct();
		$serialised = self::normalise_serialised($serialised);
		$this->parentController = $parentController;
		$this->viewName = $viewName;
		$this->rawComponents = json_decode($serialised);
		$this->context = $context;

		if ($layoutManager) {
			$this->layoutManager = $layoutManager;
		} else {
			$klass = Config::inst()->get('NLView', 'layout_manager_class');
			if (!$klass) {
				throw new Exception("NLView needs a layout manager. Either pass one in, or set it up in config. See module documentation");
			}
			$this->layoutManager = Injector::inst()->create($klass);
		}
	}

	/**
	 * Return the top-level layout component for this view.
	 * This assumes that the construction of the view always has a layout component at the root.
	 */
	public function getLayout() {
		if (!$this->layout) {
			// get the view definition. We give it the raw component hierarchy and let
			// the factory component sort out what classes are actually required.
			$this->layout = NLComponent::factory($this->rawComponents, $this);
		}
		return $this->layout;
	}

	public function getLayoutManager() {
		return $this->layoutManager;
	}

	public static function get_layout_manager_class() {
		return Config::inst()->get('NLView', 'layout_manager_class');
	}

	/**
	 * Render this view.
	 * @return
	 */
	public function forTemplate() {
		Requirements::css("neolayout/css/nlcore.css");

		$layout = $this->getLayout();

		$extraClasses = array();

		// render
		return $this->customise(
			new ArrayData(array(
				"Layout" => $layout->render($this->context),
				"ExtraClasses" => implode(" ", $extraClasses),
				"URL" => $this->parentController->Link($this->viewName)
			))
		)->renderWith("NLView");
	}

	protected function getComponentItems() {
		$items = new ArrayList();

		$subclasses = ClassInfo::subclassesFor("NLComponent");

		// Remove abstracts
		// @todo do this programmatically
		unset($subclasses["NLComponent"]);
		unset($subclasses["NLLayoutComponent"]);

		// @todo let context filter component types
		if ($this->context && $this->context->hasMethod("filterComponents")) {
			$subclasses = $this->context->filterComponents($subclasses);
		}

		foreach ($subclasses as $class) {
			$inst = singleton($class);
			$metadata = $inst->getMetadata();
			$items->push(new NLViewAddableItem(
				isset($metadata["name"]) ? $metadata["name"] : "(unnamed)",
				isset($metadata["description"]) ? $metadata["description"] : null,
				isset($metadata["imageURL"]) ? $metadata["imageURL"] : null,
				$class
			));

		}

		return $items;
	}

	protected function findComponentById($id) {
		$layout = $this->getLayout();
		return $this->findComponentByIdParented($layout, $id);
	}

	protected function findComponentByIdParented($parent, $id) {
	}

	// Given a view whose layout is going to be edited, augment components as required for CMS presentation. This basically
	// called augmentForCMSEditor on all the components of the layout.
	public function augmentForCMSEditor() {
		$this->getLayout()->augmentForCMSEditor($this->context);
	}
}

class NLViewAddableItem extends ViewableData {
	/**
	 * @param $name
	 * @param $description
	 * @param $imageURL
	 * @param $type			type of thing. e.g. NLLinkComponent, File, Image
	 * @param $objectClass
	 * @param $objectID
	 * @param $ID			ID of object if it is an object (not valid for components)
	 */
	function __construct($name, $description, $imageURL, $type, $objectClass = null, $objectID = null, $objectBinding = null) {
		$this->name = $name;
		$this->description = $description;
		$this->imageURL = $imageURL;
		$this->type = $type;
		$this->objectClass = $objectClass;
		$this->objectID = $objectID;
		$this->objectBinding = $objectBinding;
	}
}
