<?php

// Custom element handler that transforms a custom element of the form:
//    <component type="type" attrs... >...</component>
// and renders it using neolayout components.
class NLComponentElementHandler implements CustomElementHandler {

	public function renderCustomElement(DOMNode $node, $parser, $context = null) {
		// get and validate the component type.
        $type = self::get_component_type($node);
        if (!$type) {
            return "invalid component type";
        }

        $serialised = self::get_serialised_component($type, $node, $parser, $context);

        $controller = Controller::curr();

        $view = new NLView(
            $controller, // parent controller
            "",  // viewName, required for URL injected into view markup. Required?
            $serialised,
            $context
        );

        return $view->forTemplate();

		// $id = $node->getAttribute('type');
		// // Debug::show("id is " . print_r($id, true));
		// if (!$id) {
		// 	return FALSE;
		// }

		// $element = AdaptiveElement::get()->byID($id);

		// // Get the element to render itself
		// $markup = $element->render(null);

		// // recursively invoke the shortcode parser on the result, in case the element returns shortcodes
		// // itself.
		// return $parser->parse($markup);
	}

    protected static function get_component_type($node) {
        // if type is not set, that's a problem.
        $type = $node->getAttribute('type');
        if (!$type) {
        	return null;
        }

        // check the class name itself
        if (self::valid_component_class($type)) {
            return $type;
        }

        // if that wasn't found, try prefixing it with NL
        $type = "NL" . $type;
        if (self::valid_component_class($type)) {
            return $type;
        }

        return null;
    }

    // test if a class name is a valid selection for a component. Class must exist, and be a
    // subclass of NLComponent.
    protected static function valid_component_class($type) {
        if (!ClassInfo::exists($type)) {
            return false;
        }

        if (!is_subclass_of($type, "NLComponent")) {
            return false;
        }

        return true;
    }

    protected static function get_serialised_component($type, $node, $parser, $context) {
        $properties = array();
        for ($i = 0; $i < $node->attributes->length; $i++) {
        	$attr = $node->attributes->item($i);
        	if ($attr->nodeName != 'type') {
        		$propName = self::map_prop_name($type, $attr->nodeName);
        		if ($propName != null) {
					$properties[$propName] = $attr->nodeValue;
        		}
        	}
        }

        $children = self::get_children($node, $parser, $context);
        $component = self::new_component($type, $properties, $children);

        return json_encode($component);
    }

    private static $reverse_prop_map = array();

    // Given the name of a valid NLComponent derivative, and an attribute name from the custom element,
    // determine the property name as the component expects to see it. This is required because tinymce forces
    // attributes to lower case, but the component properties are camel-capped. We do this by dynamically
    // building a reverse map of properties for each component type.
    protected static function map_prop_name($type, $attrName) {
    	if (!isset(self::$reverse_prop_map[$type])) {
    		$inst = Object::create($type);
    		$objectMetadata = $inst->getProperties();
			self::$reverse_prop_map[$type] = array();
    		foreach ($objectMetadata as $prop => $def) {
    			self::$reverse_prop_map[$type][strtolower($prop)] = $prop;
    		}
    	}

    	if (isset(self::$reverse_prop_map[$type][$attrName])) {
	    	return self::$reverse_prop_map[$type][$attrName];
    	}

    	return null;
    }

    // helper function to create a raw component that we can serialise
    // handles '=' binding syntax.
    // move to neolayout and generalise.
    protected static function new_component($componentType, $properties, $children = null, $layout = null) {
        $bindings = array();
        foreach ($properties as $key => $value) {
            // $key = self::normalise_component_property($key);
            if (substr($value, 0, 2) == '==') {
                // we want a single literal =
                $bindings[$key] = array(
                    'type' => 'embedded',
                    'value' => substr($value, 1)
                );
            } else if (substr($value, 0, 1) == '=') {
                // we want to bind to a field
                $bindings[$key] = array(
                    'type' => 'context',
                    'value' => $value
                );
            } else {
                // we want to bind to a literal
                $bindings[$key] = array(
                    'type' => 'embedded',
                    'value' => $value
                );
            }
        }

        $result = array(
            'componentType' => $componentType,
            'ClassName' => $componentType,
            'bindings' => $bindings
        );

        if ($children) {
            $result['children'] = $children;
        }
        if ($layout) {
            $result['layout'] = $layout;
        }

        return $result;
    }

    // Get the children. This will be an array of NLComponents, which are encapsulated versions of
    // the child of $node.
    protected static function get_children($node, $parser, $context) {
    	// First, apply substitutions to children.
    	CustomElementsParser::reduce_in_children($node, $parser, $context);

    	$result = array();

    	return $result;
    }

}