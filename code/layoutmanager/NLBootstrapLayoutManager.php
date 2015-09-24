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
 *					}
 *				}
 *			}
 */
class NLBootstrapLayoutManager extends ViewableData implements NLLayoutManager {
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
		if (!$component->layout || !$component->layout->bootstrap) {
			// nothing to see here
			return $extras;
		}

		if ($component->layout->bootstrap->columns) {
			$cols = $component->layout->bootstrap->columns;
			$sizes = array('xs', 'sm', 'md', 'lg');
			foreach ($sizes as $size) {
				if ($cols->$size) {
					$d = $cols->$size;
					// process a size structure:
					//	md: {
					//		width: 3,  // e.g. col-md-3
					//		offset: 1, // e.g. col-md-offset-1
					//		push: 0,
					//		pull: 0
					//	}
					if ($d->width) {
						$extras['classes'][] = 'col-' . $size . '-' . $d->width;
					}
					if ($d->offset) {
						$extras['classes'][] = 'col-' . $size . '-offset-' . $d->offset;
					}
					if ($d->push) {
						$extras['classes'][] = 'col-' . $size . '-push-' . $d->push;
					}
					if ($d->pull) {
						$extras['classes'][] = 'col-' . $size . '-pull-' . $d->pull;
					}
				}
			}
		}

		return $extras;
	}
}
