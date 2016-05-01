<?php

/**
 * NLComponent is the base class for all objects that can appear in an NLView. This holds common behaviour of
 * all components, and includes a factory method for constructing an NLComponent hierarchy given a raw object
 * representation.
 *
 * The serialised form of a component tree is represented as a json expression. e.g.:
 * {
 *     "ClassName": "NLVerticalBoxLayout",
 *     "children": [
 *         { "ClassName": "NLTextComponent", "Text": "Some text" }
 *     ],
 *     "bindings": {
 *         "myproperty": {}
 *     },
 *     "layout": {
 *         (layout properties defined by the layout manager/parent)
 *     }
 * }
 *
 * There is a relationship between properties and bindings. Properties are defined per class.
 *
 * Thoughts on field definition and binding:
 * - each property has a name, and specifies the class name of a DBField-derivative.
 * - binding is performed on demand.
 * - the binding process iterates over the defined properties, and creates an instance of the datatype
 *   specified for that property. It calculates the value by examining the bound value. It evaluates that within
 *   the context, and assigns it to the value property of the field object in the binding.
 * - then rendering takes place.
 * - there needs to be a syntax in the serialised NLComponent for the binding. Probably an object that defines
 *   the place where the value comes from.
 * - bindings are assumed to be bidirectional, so that a user may edit a component and expect the value to be saved
 *   back to the context.
 * - some bindings may be unidirectional (readony). The context will define this in its metadata.
 * - the context object may provide a getViewMetadata() method, which will return a map containing what can be
 *   bound to. It would be great if this metadata is expressed in terms also of SS data types, so for example nested
 *   objects can be returned.
 * - there needs to be a way for a component to bind to values that are stored directly in the component. This will need
 *   to have very robust serialisation as it may include rich text.
 * @throws Exception
 */
abstract class NLComponent extends ViewableData {
	/**
	 * If the component type supports child components, they are represented in an array here.
	 * @var null
	 */
	protected $children = null;

	protected $rawBindings = null;

	/**
	 * This holds the binding definitions that are stored in the component. i.e. it identifies the source
	 * of values per property, but not the actual value.
	 * @var null
	 */
	protected $bindings = null;

	/**
	 * This maps properties to actual values to be rendered.
	 * @var null
	 */
	protected $bindingValues = null;

	/**
	 * An object that holds the layout properties for the component. It is initialised in the constructor from
	 * the raw object passed in.
	 * @var null
	 */
	protected $layoutValues = null;

	/**
	 * A reference to the view object.
	 * @var $view
	 */
	protected $view;

	/**
	 * Given an NLComponent object hierarchy, generate the actual NLComponent instances. The object passed in
	 * is an object structure that is a deserialised json object, so the objects are untyped. We use the ClassName
	 * property in each to determine the actual type. Bindings are done lazily; the component only interprets the
	 * binding definitions in $object later if it needs to.
	 * @static
	 * @param $object
	 * @param $context
	 * @return void
	 */
	public static function factory($object, $view) {
		if (!isset($object->ClassName)) {
			throw new Exception("NLComponent has no class information");
		}

		$className = $object->ClassName;
		$real = new $className($object);

		// Store the raw bindings for later, only interpret this on demand.
		$real->rawBindings = null;
		if (isset($object->bindings)) {
			$real->rawBindings = $object->bindings;
		}

		$real->layoutValues = null;
		if (isset($object->layout)) {
			$real->layoutValues = $object->layout;
		}

		$real->view= $view;

		// Now recursively create the real components for each child of this component.
		$real->children = array();
		if (isset($object->children)) {
			foreach ($object->children as $child) {
				$real->children[] = NLComponent::factory($child, $view);
			}
		}

		return $real;
	}

	/**
	 * Return a map of metadata properties about this component type. Every component class should define
	 * this method. Not all properties need to be defined for each component type. getMetadataCombined can be used
	 * to get metadata values, with properties inherited up the component hierarchy.
	 *
	 * Keys that are understood are:
	 * - name:			human language name to be display in UI when editing.
	 * - description:	description of the component for display in UI when editing.
	 * - imageURL:		path to image on server that can be used in UI when editing. The image should be square. It may
	 * 					be scaled to different sizes.
	 * - display		defines how the component is rendered:
	 * 					"inline"		component is generated inline with a span.
	 * 					"block"			component is generated as block with a div.
	 * - properties 	a map of properties that are understood by this type of component, and the data type, of
	 * 					the following form:
	 *
	 * array(
	 *   "myproperty" => array(
	 *      "type" => "Text",
	 *      "description" => "This is my property"
	 *    )
	 * )
	 *
	 * @return array
	 */
	static public function get_metadata() {
		return array(
			"name" => "Generic component",
			"description" => "Generic component, cannot be added by itself",
			"imageURL" => null,
			"display" => "block",
			"properties" => array()
		);
	}

	public function getMetadataValue($key) {
		$metadata = $this->getMetadata();
		if (!isset($metadata[$key])) {
			return null;
		}
		return $metadata[$key];
	}

	private $_metadata = null;

	/**
	 * Return the metadata array, which is derived from get_metadata but includes inheriting properties from the
	 * parent.
	 * @return void
	 */
	public function getMetadata() {
		if ($this->_metadata) {
			return $this->_metadata;
		}
		$class = get_class($this);
		$result = array();
		while ($class) {
			$d = $class::get_metadata();
			foreach ($d as $key => $value) {
				if (!isset($result[$key])) {
					$result[$key] = $value;
				}
			}
			if ($class == "NLComponent") {
				$class = null;
			} else {
				$class = get_parent_class($class);
			}
		}
		$this->_metadata = $result;
		return $result;
	}

	/**
	 * Shorthand form of getting properties, which comes from metadata structure.
	 */
	protected function getProperties() {
		$metadata = $this->getMetadata();
		return $metadata["properties"];
	}

	/**
	 * Return the binding definitions, mapping properties to where they get values from. This comes from the
	 * raw bindings, and is processed on demand and stored into $this->bindings.
	 * @return map		Maps properties to NLBindingDefinition objects
	 */
	protected function getBindingDefinitions() {
		if (!$this->bindings) {
			// We don't have bindings yet, so process the raw bindings.
			$this->bindings = array();
			$props = $this->getProperties();
			if ($props) {
				foreach ($props as $property => $definition) {
					$raw = null;
					if (isset($this->rawBindings->$property)) {
						$raw = $this->rawBindings->$property;
					}

					if (!is_object($raw)) {
						$raw = null;
					}

					$bindingDef = new NLBindingDefinition($property, $definition, $raw);

					$this->bindings[$property] = $bindingDef;
				}
			}
		}
		return $this->bindings;
	}

	/**
	 * @param object	$context
	 * @return ViewableData		Maps properties to actual values. Uses NLBindingDefinition to determine where the value
	 * 							comes from, using context. Tolerant of errors.
	 */
	public function getBindingValues($context) {
		if (!$this->bindingValues) {
			// We don't have values, let's get them.
			$this->bindingValues = new ViewableData();
			$bindings = $this->getBindingDefinitions();
			foreach ($bindings as $property => $bindingDef) {
				$this->bindingValues->$property = $bindingDef->getValue($context);
			}
		}
		return $this->bindingValues;
	}

	/**
	 * Return the layout values. These are stored in the serialised object, and managed by the parent. This is a raw
	 * object that can have any properties set by the layout manager. If there is no layout object defined,
	 * a new stdClass object is returned, so the call doesn't have to check if its null or not.
	 * @return object
	 */
	public function getLayoutValues() {
		if (!$this->layoutValues) {
			$this->layoutValues = new stdClass();
		}
		return $this->layoutValues;
	}

	/**
	 * render() generates the HTML for the component, including generic containment. Generally subclasses shouldn't
	 * override this, but will override renderContent. The parent component (typically layout components) can provide
	 * extra properties that affect the containment.
	 * @param $context		Context for binding.
	 * @param $extras		Map that can contain the following keys:
	 * 						- "classes" - an array of CSS class names to be added.
	 * 						- "styles" - a map of style definitions that are aggregated into the style attribute
	 * 								of the container.
	 * 						- "attrs" - a map of additional attributes to add to the containment tag. This
	 * 								shouldn't include "class" or "style" keys. Values should not be quoted.
	 * @return string
	 */
	function render($context, $extras = null) {
		$lm = $this->view->getLayoutManager();

		// Give the layout manager the first opportunity to render. If it handles this component,
		// it is expected to handle the entire component render. This is not the normal case, it's
		// just a hook.
		$r = $lm->render($this, $this->view, $context, $extras);
		if ($r !== FALSE) {
			return $r;
		}

		// This is a more common case, where the layout manager is given the opportunity to
		// provide extra classes or attributes for this component.
		$extras = $lm->augmentExtras($this, $this->context, $extras);

		// Determine the CSS classes of the container.
		$classes = $this->containerClasses($context);
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

		$componentTag = ($this->getMetadataValue("display") == "block") ? "div" : "span";

		return $this->customise(
			new ArrayData(array(
				"Tag" => $componentTag,
				"Content" => $this->renderContent($context),
				"ClassName" => get_class($this),
				"ExtraClasses" => $cssClasses,
				"ExtraStyles" => $styles,
				"ExtraAttrs" => $attrs
			))
		)->renderWith("NLComponentContainment");
	}

	public function getChildren() {
		return $this->children;
	}

	/**
	 * renderContent generates the HTML that goes inside the generic component containment. Subclasses need
	 * to override this.
	 * @param $context
	 * @return string
	 */
	abstract function renderContent($context);

	/**
	 * This function can be overridden by subclasses to provide additional CSS classes to add to the component's
	 * containment markup. Generally treated as additive, if a subclass overrides this, it should also add the classes
	 * of the parent. The classes are made unique before being rendered.
	 * @return array	An array of CSS class names to add to the container. Can be empty.
	 */
	protected function containerClasses($context) {
		return array();
	}

	/**
	 * Return the maximum number of children allowed for this type of component. Subclasses can override it.
	 * Values understood are:
	 * - 0			no children allowed
	 * - n			where n is a cardinal number, indicates at most that many children are allowed
	 * - m:n		where m and n are cardinal numbers, indicates that there must be at least m and and most n (inclusive)
	 *				Note m and n can be the same, indicating exactly that number. n can also be '*' indicating no maximum
	 * - *			Any number of children are permitted, including 0. To indicate 1 or more, return 1:*
	 * @return void
	 */
	function maxChildren() {
		return 0;
	}
}

/**
 * An object that defines a binding. Cases include:
 * - a method in the context.
 * - a dereferenced object in the context, as the templating engine does.
 * - a constant value that is embedded in the component itself (an represented in the binding defintion.
 * - a value that changes dynamically in the browser, in response to an event. A DataChange event might be thrown
 *   by a component in javascript, and this property binding will automatically listen, and an ajax request
 *   automatically fired to refresh the component's display based on the new binding.
 * Instances represent how a value is to be retrieve, and can also retrieve the value given a context.
 *
 * @todo Another binding mode to consider: bind to same thing as specified property on another component in the view.
 */
class NLBindingDefinition {
	const BIND_EMBEDDED = "embedded";
	const BIND_CONTEXT = "context";
	const BIND_EVENT = "event";
	const BIND_NONE = "none";

	/**
	 * Type of binding. Values:
	 * - "embedded" - the property is bound to a value embedded in the component, stored in $value.
	 * - "context" - the property is bound to a method in the context. The specification of the method is stored in $value.
	 * - "event" - the property is bound to an event listener in the client. This is useful when there are multiple
	 *             components related to each other, and they can communicate via events in javascript.
	 * - "none" - the property is not bound to anything.
	 * @var $type
	 */
	protected $type;

	/**
	 * Constructor takes an optional raw PHP object (e.g. stdClass) and interprets the properties to build
	 * the binding definition object. If $raw is null, we build a binding that represents "unbound".
	 * @param $raw
	 */
	function __construct($propertyName, $propertyDef, $raw = null) {
		$this->propertyName = $propertyName;
		$this->propertyDef = $propertyDef;

		$this->value = null;
		if (isset($raw->type)) {
			$this->type = $raw->type;
			$this->value = null;
			if (isset($raw->value)) {
				$this->value = $raw->value;
			}

			// Validate $this->value
			switch ($raw->type) {
				case NLBindingDefinition::BIND_EMBEDDED:
				case NLBindingDefinition::BIND_CONTEXT:
				case NLBindingDefinition::BIND_EVENT:
				case NLBindingDefinition::BIND_NONE:
				default:
			}
		}
		else {
			$this->type = NLBindingDefinition::BIND_NONE;
		}
	}

	/**
	 * Return the value associated with a binding.
	 * - if the binding is unbound, return null
	 * - if the binding is a constant, return it
	 * - if the binding is a reference within the context, attempt to retrieve that value.
	 * @param $context
	 * @return DBField		Returns a subclass of DB field, as defined by getProperties for the class,
	 * 						with the value assigned, or null if unbound.
	 */
	function getValue($context) {
		$type = $this->getBaseType($this->propertyDef['type']);
		$inst = Object::create_from_string($type, $this->propertyName);
		$inst->setValue($this->value);
		switch ($this->type) {
			case NLBindingDefinition::BIND_EMBEDDED:
				$value = $inst->getValue();
				break;

			case NLBindingDefinition::BIND_CONTEXT:
				// @todo NLBindingDefinition: consider if BIND_CONTEXT could contain something other than a function or property
				// @todo on the context. Currently assumes instance only. What about statics?

				// $this->value contains the identifier within the context.
				$methodOrProp = $inst->getValue();

				// If that identifier is a function, call it, otherwise just reference it as a property.
				if (method_exists($context, $methodOrProp)) {
					$value = $context->$methodOrProp();
				} else {
					$value = $context->$methodOrProp;
				}
				break;

			case NLBindingDefinition::BIND_EVENT:
				// @todo Implement NLBindingDefinition::getValue BIND_EVENT case
				$value = null;
				break;

			case NLBindingDefinition::BIND_NONE:
				$value = null;
				break;
		}

		return $value;
	}

	function getBaseType($t) {
		$i = strpos($t, "|");
		if ($i === FALSE) {
			return $t;
		}
		return substr($t, 0, $i);
	}

	/**
	 * Get from context. $this->value to contain the expression? This value is built by the editor.
	 * @todo Detect types - how to handle type mismatches
	 * Context reference can be of the form:
	 * - { scope "." }* ident ["(" expr { "," expr}")"]
	 * - expr:		number |
	 * 				string-literal |
	 * 				jquery-selector
	 * 
	 *
	 */
	function getFromContext($context) {

	}
}
