<?php

// Layout editor field for CMS. This can be used if the layout is defined on a page, and we want the CMS editor
// to be able to define the layout.
// The editor is largely written in javascript. The field loads the javascript editor with the view configuration. The save
// then serialises this back into the source object.

class NLCMSLayoutEditorField extends HiddenField {

	protected $viewControllerURL;

	// If provided, this is used to derive what information the context can provide.
	protected $contextInstance = null;

	private static $allowed_actions = array(
		'imageSearch'
	);

	// Constructor is normal. The owning context should be passed in as the value; it's not really the value,
	// as we'll ask the context for details about what should be presented to for the given user.
	function __construct($name, $title = null, $context = null) {
		$this->contextInstance = $context;
		parent::__construct($name, $title, $context);
	}

	function EditorID() {
		return $this->ID() . "_editor";
	}

	function FieldHolder($properties = array()) {
		return $this->renderWith(array("NLCMSLayoutEditorField"));
	}

	// When we present back to the CMS, we give components the chance to augment what they present back. This allows for
	// things like component thumbnails that can be added to what the CMS sees, without actually storing these in the layout.
	// We don't want to pollute the layout with CMS properties that rendering on the front end don't actually require.
	function getValue() {
		// $this->value is the JSON representation in a string, so first parse it into the data structure.
		// @todo is controller, form name required?
		$view = new NLView(null, '', $this->value, $this->contextInstance);

		// Apply normalisations across the component hierarchy.
		$view->augmentForCMSEditor();

		// Convert back into a JSON in a string.
		$v = json_encode($view->getLayout()->toRaw());

		return Convert::raw2att(NLView::normalise_serialised($v));
	}

	function Field($properties = array()) {
		return '<input id="' . $this->ID() . '" name="' . $this->getName() . '" type="hidden" value="' . $this->getValue() . '" />';
	}

	public function setViewControllerURL($url) {
		$this->viewControllerURL = $url;
	}

	public function setContext($context) {
		$this->contextInstance = $context;
	}

	public function ViewControllerURL() {
		return $this->viewControllerURL;
	}

	// Return a json object containing metadata that is useful to the editor. It's made up of 3 parts,
	// the palette of largely pre-rendered components, the component type info itself which the property
	// editor needs, and the properties available in the context.
	public function EditorMetadata()  {
		$components = $this->ComponentTypeMetadata();

		$obj = array();
		$obj['palette'] = $this->Palette($components);
		$obj['componentTypes'] = $components;
		$obj['context'] = $this->ContextMetadata();
		$obj['settings'] = $this->getGlobalSettings();

		return Convert::raw2xml(json_encode($obj));
	}

	// Return a json string that contains all information for the palette. This is an ordered list of objects,
	// where the objects represent the tabs of the palette.
	// Each palette tab is an object of the form:
	// 		{
	//			type: 'type, below',
	//			name: 'display name of palette tab'
	//			items: [
	//				(paletteItem objects, below)
	//			]
	//		}
	// The 'type' property determines what palette component is used to display the items. The types initially supported
	// include:
	//		- 'files': uses a file browser component
	//      - 'generic': displays items only component
	protected function Palette($components) {
		$palette = $this->scaffoldPalette($components);

		// Ask the context if it wants to change the palette. It may remove some items,
		// or add new items.
		if ($this->contextInstance->hasMethod('updateLayoutPalette')) {
			$palette = $this->contextInstance->updateLayoutPalette($palette);
		}

		return $palette;
	}

	static protected function isLayoutComponent($component) {
		$inst = Object::create($component['componentType']);
		return $inst instanceof NLLayoutComponent;
	}

	// Generate what we think the palette is
	protected function scaffoldPalette($components) {
		$result = array();

		$result[] = $this->scaffoldPaletteFields();
		$result[] = $this->scaffoldPaletteImages();
		$result[] = $this->scaffoldPaletteComponents($components, 'Layout', function($component) {
			return self::isLayoutComponent($component);
		});
		$result[] = $this->scaffoldPaletteComponents($components, 'Components', function($component) {
			return !self::isLayoutComponent($component);
		});

		return $result;
	}

	protected function scaffoldPaletteFields() {
		$result = array(
			'title' => 'Fields',
			'type' => 'generic'
		);

		$fields = $this->deriveContextMetadata();
		foreach ($fields as $name => $def) {
			// Only add text field variations. Other fields are still available for binding, but the fields on the fields
			// tab are just conveniences.
			if ($def != 'Text' && substr($def, 0, 7) != 'Varchar' && substr($def, 0, 8) != 'HTMLText') {
				continue;
			}

			$title = self::split_camel_word($name);
			$proto = array(
				'componentType' => 'NLTextComponent',
				'bindings' => array(
					'Text' => array(
						'type' => 'context',
						'value' => $name
					)
				),
				'_cmsHints' => array(
					'title' => self::split_camel_word($title),
					'description' => $title . ' text field'
				)
			);

			$result['items'][] = $proto;
		}


		return $result;
	}

	protected function scaffoldPaletteImages() {
		return array(
			'title' => 'Images',
			'type' => 'images'
		);
	}

	protected function scaffoldPaletteComponents($components, $title, $filter) {
		$result = array(
			'title' => $title,
			'type' => 'generic'
		);

		foreach ($components as $c) {
			if (!$filter($c)) {
				continue;
			}

			// Add a component prototype that only has component type, and no bindings.
			// @todo consider if defaulted. If so, this should probably be in a component construction helper.
			$result['items'][] = array(
				'componentType' => $c['componentType'],
				'bindings' => array(),
				'_cmsHints' => array(
					'title' => $c['name'],
				)
			);
		}

		return $result;
	}

	// Retrieve global settings that are not related to the specific layout
	function getGlobalSettings() {
		return array(
			'layoutManager' => NLView::get_layout_manager_class()
		);
	}

	// Inject a javascript variable that contains the definition of the components.
	function ComponentTypeMetadata() {
		$classes = ClassInfo::subclassesFor("NLComponent");

		$result = array();

		foreach ($classes as $class) {
			if (in_array($class, array("NLComponent"))) {
				continue;
			}

			$rc = new ReflectionClass($class);
			if ($rc->isAbstract()) {
				continue;
			}

			$inst = new $class();
			$metadata = $inst->getMetadata();

			if (!$metadata['imageURL']) {
				$metadata['imageURL'] = 'neolayout/images/unknown-component.png';
			}

			$metadata["componentType"] = $class;

			$result[] = $metadata;
		}

		return $result;
	}

	// Compute a JSON structure that tells the editor what is available in the context.
	function ContextMetadata() {
		// Get a map of field names mapping to metadata about the property
		return $this->deriveContextMetadata();
	}

	// Generate a (possible empty) map of field names to field metadata that can be used by the editor to know
	// what's available for the user to choose from. It is derived as follows:
	//	- If there is no $this->contextInstance, return an empty map.
	//	- If $this->contextInstance has a getNLContextMetadata() function, call it and return it.
	//	- If $this->contextInstance is a DataObject derivative, calculate the fields to return.
	//	  This won't be able to infer methods, as there is no explicit return type to match against.
	// @todo Provide 'parent' method for contexts to automatically derive defaults as getCMSFields does, and it can add specific methods/properties.
	// @todo Decide if default field set needs to be filtered to exclude system values.
	function deriveContextMetadata() {
		if (!$this->contextInstance) {
			return array();
		}

		if (method_exists($this->contextInstance, 'getNLContextMetadata')) {
			return $this->contextInstance->getNLContextMetadata();
		}

		if (!(is_subclass_of($this->contextInstance, 'DataObject'))) {
			return array();
		}

		// OK, we have a data object. Get all the fields. Strip out system fields and the field we're editing. And return that.
		$result = array();
		$fields = $this->contextInstance->db();

		foreach ($fields as $key => $value) {
			// Don't add the dynamic layout field we're editing.
			if ($key == $this->ID()) {
				continue;
			}

			// Certain types need manipulation, especially lengths, which we don't care about.
			if (substr($value, 0, 8) == 'Varchar(') {
				$value = 'Varchar';
			}
			$result[$key] = $value;
		}

		return $result;
	}

	// Split a camel cased word into space-separated words. Handles acronyms.
	// from http://stackoverflow.com/questions/4519739/split-camelcase-word-into-words-with-php-preg-match-regular-expression
	public static function split_camel_word($s) {
		$re = '/(?#! splitCamelCase Rev:20140412)
		    # Split camelCase "words". Two global alternatives. Either g1of2:
		      (?<=[a-z])      # Position is after a lowercase,
		      (?=[A-Z])       # and before an uppercase letter.
		    | (?<=[A-Z])      # Or g2of2; Position is after uppercase,
		      (?=[A-Z][a-z])  # and before upper-then-lower case.
		    /x';
		$a = preg_split($re, $s);
		return implode(' ', $a);
	}

	public function imageSearch() {
		if (isset($_REQUEST['title'])) {
			$title = $_REQUEST['title'];
		} else {
			$title = '';
		}

		$images = Image::get()->filter('Title:PartialMatch', $title)->limit(50);

		$r = array();
		foreach ($images as $image) {
			$resized = $image->SetRatioSize(120,120);
			$r[] = array(
				'ID' => $image->ID,
				'Title' => $image->Title,
				'ThumbnailURL' => $resized->Link()
			);
		}

		$result = array(
			'items' => $r
		);

		return json_encode($result);
	}
}