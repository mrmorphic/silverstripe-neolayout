<?php

class NLInlineLayout extends NLLayoutComponent {

	static public function get_metadata() {
		return array(
			"name" => "Inline layout",
			"description" => "Lets you group other items, and displays them inline.",
			"imageURL" => null
		);
	}

	function containerClasses($context) {
		$result = parent::containerClasses($context);

		$v = $this->getBindingValues($context);
		if ($v->Orientation == "Horizontal") {
			$result[] = "box-horiz";
		} else {
			$result[] = "box-vert";
		}

		return $result;
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
