<?php

/**
 * Box layout component, which implements a simple vertical or horizontal box for laying out its children.
 */
class NLBoxLayout extends NLLayoutComponent {

	static public function get_metadata() {
		return array(
			"name" => "Box layout",
			"description" => "Lets you group other items, and arrange them either vertically or horizontally",
			"imageURL" => null,
			"properties" => array(
				"Orientation" => array(
					"type" => "Enum('Vertical,Horizontal','Vertical')"
				)
			)
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
