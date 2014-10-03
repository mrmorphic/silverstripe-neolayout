<?php

/**
 * Base class for layout components.
 */
abstract class NLLayoutComponent extends NLComponent {

	function maxChildren() {
		return "*";
	}

	function containerClasses($context) {
		$a = parent::containerClasses($context);
		$a[] = "layout-container";
		return $a;
	}
}
