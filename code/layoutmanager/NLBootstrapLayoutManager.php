<?php

/**
 * Layout manager for bootstrap. Designed to work with bootstrap 3. It assumes that
 * bootstrap 3 has been added to the parent project.
 *
 * This uses each component's 'layout' property to define bootstrap behaviour, as indicated below.
 * It is the responsibility of the layout editor in the CMS to set these values appropriately.
 *	-	a child of a horizontal box (which will be a column in bootstrap) can contain a 'columns'
 *		sub-property:
 *			layout: {
 *				bootstrap: {
 *					columns: {
 *						md: {
 *							width: 3,  // e.g. col-md-3
 *							offset: 1, // e.g. col-md-offset-1
 *							push: 0,
 *							pull: 0
 *						}
 *					},
 *					visibility: {
 *						lg: "visible",
 *						xs: "hidden"
 *					}
 *				}
 *			}
 */
class NLBootstrapLayoutManager extends ViewableData implements NLLayoutManager {
	static $sizes = array('xs', 'sm', 'md', 'lg');

	// The hook which enables the layout manager to override default behaviour for components it knows about.
	// Returns markup if it's a case it understands, or FALSE by default to indicate that the component
	// should be rendered normally.
	public function render($component, $view, $context, $extras) {
		// we don't override a while component render.
		return FALSE;
	}

	// Add any required bootstrap classes to $extras. This is particularly relevant to columns,
	// which are stored in $component->layoutValues.
	public function augmentExtras($component, $context, $extras) {
		if (!$extras) {
			$extras = array();
		}
		if (!isset($extras['classes'])) {
			$extras['classes'] = array();
		}

		$c = get_class($component);
		switch ($c) {
			case 'NLHorizontalBoxLayout':
				$extras['classes'][] = 'row';
				break;
			default:
		}

		return $this->calcLayoutClasses($component, $context, $extras);
	}

	// If the component has layout.bootstrap set, augment $extras with additional
	// classes and attributes accordingly.
	protected function calcLayoutClasses($component, $context, $extras) {
		$layout = $component->getLayoutValues();
		if (!$layout || !isset($layout->bootstrap)) {
			// nothing to see here
			return $extras;
		}

		if (isset($layout->bootstrap->columns)) {
			$cols = $layout->bootstrap->columns;
			foreach (self::$sizes as $size) {
				if (isset($cols->$size)) {
					$d = $cols->$size;
					// process a size structure:
					//	md: {
					//		width: 3,  // e.g. col-md-3
					//		offset: 1, // e.g. col-md-offset-1
					//		push: 0,
					//		pull: 0
					//	}
					if (isset($d->width) && $d->width) {
						$extras['classes'][] = 'col-' . $size . '-' . $d->width;
					}
					if (isset($d->offset) && $d->offset) {
						$extras['classes'][] = 'col-' . $size . '-offset-' . $d->offset;
					}
					if (isset($d->push) && $d->push) {
						$extras['classes'][] = 'col-' . $size . '-push-' . $d->push;
					}
					if (isset($d->pull) && $d->pull) {
						$extras['classes'][] = 'col-' . $size . '-pull-' . $d->pull;
					}
				}
			}
		}

		if (isset($layout->bootstrap->visibility)) {
			$vis = $layout->bootstrap->visibility;

			foreach (self::$sizes as $size) {
				if (isset($vis->$size)) {
					$v = $vis->$size;
					if ($v == 'visible' || $v == 'hidden') {
						$extras['classes'][] = $v . '-' . $size;
					}
				}
			}
		}

		return $extras;
	}
}
