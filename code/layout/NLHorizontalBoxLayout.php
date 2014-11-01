<?php

/**
 * Box layout component, which implements a simple horizontal box for laying out its children.
 */
class NLHorizontalBoxLayout extends NLLayoutComponent {

	static public function get_metadata() {
		return array(
			"name" => "Horizontal Box layout",
			"description" => "Lets you group other items, and arrange them horizontally",
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
