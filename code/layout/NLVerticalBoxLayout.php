<?php

/**
 * Box layout component, which implements a simple vertical box for laying out its children.
 */
class NLVerticalBoxLayout extends NLLayoutComponent {

	static public function get_metadata() {
		return array(
			"name" => "Vertical Box layout",
			"description" => "Lets you group other items, and arrange them vertically",
			"imageURL" => null
		);
	}

	function renderContent($context) {
		$content = "";
		if ($this->children) {
			foreach ($this->children as $child) {
				$content .= $child->render($context);
			}
		}
		return $content;
	}
}
