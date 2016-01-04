<?php

class NLDisclosure extends NLComponent {
	function maxChildren() {
		return "1:1";
	}

	static public function get_metadata() {
		return array(
			"name" => "Disclosure",
			"description" => "Add content within an accessible disclosure widget",
			"imageURL" => null,
			"display" => "block",
			"properties" => array(
				"ExpanderLabel" => array(
					"name" => "Expander label",
					"type" => "Text",
					"description" => "Label to display on the expand/collapse link"
				),
				"OpenByDefault" => array(
					"name" => "Open by default",
					"type" => "Boolean",
					"description" => "If enabled, disclosure widget is open by default"
				)
			)
		);
	}

	// @todo default expander text if not set
	function renderContent($context) {
		$v = $this->getBindingValues($context);

		// Generate the content from the children that we're describing.
		$content = '';
		if (count($this->children) > 0) {
			foreach ($this->children as $child) {
				$content .= $child->render($context);
			}
		}

		$html = new HTMLText();
		$html->setValue($content);

		$openClause = '';
		$ariaExpandedClause = 'aria-expanded="false"';
		if ($v->OpenByDefault) {
			$openClause = 'open';
			$ariaExpandedClause = 'aria-expanded="true"';
		}

		$expander = $this->renderWith('NLDisclosure', array(
			'ExpanderLabel' => $v->ExpanderLabel,
			'OpenClause' => $openClause,
			'AriaExpandedClause' => $ariaExpandedClause,
			'Content' => $html
		));

		return $expander;
	}
}
