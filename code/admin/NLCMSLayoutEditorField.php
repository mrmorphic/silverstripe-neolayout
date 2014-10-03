<?php

// Layout editor field for CMS. This can be used if the layout is defined on a page, and we want the CMS editor
// to be able to define the layout.
// The editor is largely written in javascript. The field loads the javascript editor with the view configuration. The save
// then serialises this back into the source object.

class NLCMSLayoutEditorField extends HiddenField {

	protected $viewControllerURL;

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
		return "(" . Convert::raw2att(NLView::normalise_serialised($this->value)) . ")";
	}

	function Field($properties = array()) {
		return '<input id="' . $this->ID() . '" name="' . $this->getName() . '" type="hidden" value="' . $this->getValue() . '" />';
	}

	public function setViewControllerURL($url) {
		$this->viewControllerURL = $url;
	}

	public function ViewControllerURL() {
		return $this->viewControllerURL;
	}

	function ComponentTypes() {
		$result = new ArrayList();

		$classes = ClassInfo::subclassesFor("NLComponent");

		// @todo sort these in some meaningful way

		foreach ($classes as $class) {
			if (in_array($class, array("NLComponent", "NLBoxLayout"))) continue;

			$rc = new ReflectionClass($class);
			if ($rc->isAbstract()) continue;

			$inst = new $class();
			$metadata = $inst->getMetadata();
//			Debug::show(print_r($metadata,true));
			$metadata["componentType"] = $class;

			$result->push(new ArrayData($metadata));
		}

		return $result;
	}
	// Inject a javascript variable that contains the definition of the components.
	function injectComponentMetadata() {
		$js = "if (typeof nl_component_types === 'undefined') var nl_component_types = [];\n";
		$js .= "nl_component_types =[\n";

		$classes = ClassInfo::subclassesFor("NLComponent");

		// @todo sort these in some meaningful way

		foreach ($classes as $class) {
			if (in_array($class, array("NLComponent", "NLBoxLayout"))) continue;

			$rc = new ReflectionClass($class);
			if ($rc->isAbstract()) continue;

			$inst = new $class();
			$metadata = $inst->getMetadata();
			$metadata["componentType"] = $class;

			$js .= json_encode($metadata) . ",";
		}

		$js .= "{}\n";

		$js .= "];\n";

		Requirements::customScript($js);
	}
}