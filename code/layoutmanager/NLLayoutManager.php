<?php

interface NLLayoutManager {
	/**
	 * Render a component in it's entirety. This will either return the required markup,
	 * or will return FALSE. The intended behaviour is that the layout manager will generally
	 * return FALSE so that components are rendered as per default, but that certain
	 * components, most especially layout components, may be translated into different markup
	 * according to the CSS framework being used.
	 */
	function render($component, $view, $context, $extras);

	/**
	 * In the rendering process, this function is called to give the layout manager the opportunity
	 * to modify the "extras" object. This object is used to defined things that should be added
	 * to the container element for the component. It contains:
	 *		- "classes" - maps to an array of CSS class names to be added.
	 *		- "styles" - maps to a map of style definitions that are aggregated into the style attribute
	 *			of the container.
	 *		- "attrs" - maps to a map of additional attributes to add to the containment tag. This
	 *			shouldn't include "class" or "style" keys. Values should not be quoted.
	 * Typically, the layout manager will use the layoutValues property, which are specific to the layout manager,
	 * to determine what extra classes to add.
	 */
	function augmentExtras($component, $context, $extras);
}