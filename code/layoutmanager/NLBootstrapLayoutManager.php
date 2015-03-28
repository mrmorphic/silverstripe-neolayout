<?php

/** Layout manager for bootstrap. Designed to work with bootstrap 3. It assumes that
 * bootstrap 3 has been added to the parent project.
 */
class NLBootstrapLayoutManager extends ViewableData implements NLLayoutManager {
	// The hook which enables the layout manager to override default behaviour for components it knows about.
	// Returns markup if it's a case it understands, or FALSE by default to indicate that the component
	// should be rendered normally.
	public function render($component, $view, $context, $extras) {
		if (is_a($component, "NLHorizontalBoxLayout")) {
			return $this->renderHorizontalBoxLayout($component, $view, $context, $extras);
		} else if (is_a($component, "NLVerticalBoxLayout")) {
			return $this->renderVerticalBoxLayout($component, $view, $context, $extras);
		}

		return FALSE;
	}

	// Add any required bootstrap classes to $extras. This is particularly relevant to columns,
	// which are stored in $component->layoutValues.
	public function augmentExtras($component, $context, $extras) {
		if ($component->layoutValues && property_exists($component->layoutValues, "classes")) {
			if (!$extras) {
				$extras = array();
			}
			if (!isset($extras["classes"])) {
				$extras["classes"] = array();
			}
			$extras["classes"] = $component->layoutValues->classes;
			return $extras;
		}

		return $extras;
	}

	// A horizontal box in bootstrap , withis a dev with children rendered using "col-*" classes.
	protected function renderHorizontalBoxLayout($component, $view, $context, $extras) {
		// Determine the CSS classes of the container.
		$classes = $component->containerClasses($context);
		if (isset($extras["classes"])) {
			$classes = array_merge($classes, $extras["classes"]);
		}
		$cssClasses = implode(" ", array_unique($classes));

		// Determine the styles of the container.
		$styles = array();
		if (isset($extras["styles"])) {
			foreach ($extras["styles"] as $name => $value) {
				$styles[] = $name . ":" . $value;
			}
		}
		$styles = implode(";", $styles);

		// Determine the attributes of the container.
		$attrs = array();
		if (isset($extras["attrs"])) {
			foreach ($extras["attrs"] as $name => $value) {
				$attrs[] = $name . "=\"" . Convert::raw2htmlatt($value) . "\"";
			}
		}
		$attrs = implode(" ", $attrs);

		$componentTag = ($component->getMetadataValue("display") == "block") ? "div" : "span";

		return $component->customise(
			new ArrayData(array(
				"Tag" => $componentTag,
				"Content" => $component->renderContent($context),
				"ClassName" => get_class($component),
				"ExtraClasses" => $cssClasses,
				"ExtraStyles" => $styles,
				"ExtraAttrs" => $attrs
			))
		)->renderWith("NLComponentContainment");
	}

	// A vertical box in bootstrap is a div, with children rendered using "row" classes.
	protected function renderVerticalBoxLayout($component, $view, $context, $extras) {
		// Determine the CSS classes of the container.
		$classes = $component->containerClasses($context);
		if (isset($extras["classes"])) {
			$classes = array_merge($classes, $extras["classes"]);
		}
		$cssClasses = implode(" ", array_unique($classes));

		// Determine the styles of the container.
		$styles = array();
		if (isset($extras["styles"])) {
			foreach ($extras["styles"] as $name => $value) {
				$styles[] = $name . ":" . $value;
			}
		}
		$styles = implode(";", $styles);

		// Determine the attributes of the container.
		$attrs = array();
		if (isset($extras["attrs"])) {
			foreach ($extras["attrs"] as $name => $value) {
				$attrs[] = $name . "=\"" . Convert::raw2htmlatt($value) . "\"";
			}
		}
		$attrs = implode(" ", $attrs);

		$componentTag = ($component->getMetadataValue("display") == "block") ? "div" : "span";

		return $component->customise(
			new ArrayData(array(
				"Tag" => $componentTag,
				"Content" => $this->renderChildren($component, $context),
				"ClassName" => get_class($component),
				"ExtraClasses" => $cssClasses,
				"ExtraStyles" => $styles,
				"ExtraAttrs" => $attrs
			))
		)->renderWith("NLComponentContainment");
	}

	// Render the children of the component using the context. Here we call render
	// on the children, but injecting the "row" class.
	function renderChildren($component, $context) {
		$content = "";
		if ($component->children) {
			foreach ($component->children as $child) {
				$content .= $child->render($context, array("classes" => array("row")));
			}
		}
		return $content;
	}
}
