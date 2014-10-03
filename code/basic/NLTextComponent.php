<?php

/**
 * Represent a component with a piece of text.
 */
class NLTextComponent extends NLComponent {

	static public function get_metadata() {
		return array(
			"name" => "Text",
			"description" => "Rich text",
			"imageURL" => null,
			"display" => "inline",
			"properties" => array(
				"Text" => array(
					"type" => "Text",
					"description" => "This is my property"
				)
			)
		);
	}

	function renderContent($context) {
		$v = $this->getBindingValues($context);
		return $v->Text;
	}
}
