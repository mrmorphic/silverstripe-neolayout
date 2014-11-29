<?php

// Layout editor field for CMS. This can be used if the layout is defined on a page, and we want the CMS editor
// to be able to define the layout.
// The editor is largely written in javascript. The field loads the javascript editor with the view configuration. The save
// then serialises this back into the source object.

class NLCMSLayoutEditorField extends HiddenField {

	protected $viewControllerURL;

	// If provided, this is used to derive what information the context can provide.
	protected $contextInstance = NULL;

	function __construct($name, $title = null, $value = '') {
		parent::__construct($name, $title, $value);
	}

	function EditorID() {
		return $this->ID() . "_editor";
	}

	function FieldHolder($properties = array()) {
		return $this->renderWith(array("NLCMSLayoutEditorField"));
	}

	function getValue() {
		return Convert::raw2att(NLView::normalise_serialised($this->value));
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

	public function EditorMetadata()  {
		$s = '{ "components": ' . $this->ComponentTypeMetadata() . ',' .
			'"context": ' . $this->ContextMetadata() . '}';
		return Convert::raw2xml($s);
	}

	// Inject a javascript variable that contains the definition of the components.
	function ComponentTypeMetadata() {
		$js = "[\n";

		$classes = ClassInfo::subclassesFor("NLComponent");

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

			$js .= json_encode($metadata) . ",";
		}

		$js .= "{}\n";

		$js .= "]\n";

		return $js;
	}

	// Compute a JSON structure that tells the editor what is available in the context.
	function ContextMetadata() {
		// Get a map of field names mapping to metadata about the property
		$contextMetadata = $this->deriveContextMetadata();

		return json_encode($contextMetadata);
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
			// Certain types need manipulation, especially lengths, which we don't care about.
			if (substr($value, 0, 8) == 'Varchar(') {
				$value = 'Varchar';
			}
			$result[$key] = $value;
		}

		return $result;
	}
}