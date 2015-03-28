<?php

/**
 * layout container component, which logically acts the top-level container for a layout. 
 * When an NLView is constructed, this component is always at the top of the hierarchy,
 * It should not be removed, and new instances should not be added as childen.
 */
class NLLayoutContainer extends NLLayoutComponent {

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
