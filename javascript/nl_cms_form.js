(function($) {

	/**
	 * nl_cms_form.js handles the component editor form. Submission of the forms is handled here as well,
	 * and consists of updating the component properties in-browser.
	 */
	$('.NLEditor').entwine({
		EditingComponent: null,
		EditingCallback: null,

		// Create a form for editing config.component, and inject that form into
		// the jQuery object config.element. The dialog will have save and cancel
		// dialogs. In either case, config.callback is invoked with a boolean parameter
		// to indicate if it was saved or not. If saved, the component.config object will
		// have been updated.
		loadPropertyEditor: function(config) {
			var editor = this.createPropertyEditor(config.component, config.callback);
			this.setEditingComponent(config.component);
			this.setEditingCallback(config.callback);

			config.element.html(editor);

			this.updateFieldValues();
		},

		createPropertyEditor: function(component, callback) {
			var metadata = this.getMetadataForComponent(component);
			var editor = '<table><thead></thead><tbody>';

			if (!metadata.properties) {
				metadata.properties = {};
			}

			// iterate over the metadata properties and construct fields
			for (var prop in metadata.properties) {
				var def = metadata.properties[prop];
				if (!def._propertyName) {
					def._propertyName = prop;
				}
				editor += this.createPropertyField(def, component.bindings[prop]);
			}

			editor += "</tbody></table>";

			editor += this.propertyEditorButtons();

			return editor;
		},

		propertyEditorButtons: function() {
			var saveButton = this.newEl('button', 'Save', {class: 'action-save'});
			var cancelButton = this.newEl('button', 'Cancel', {class: 'action-cancel'});

			return this.newEl('div', saveButton + cancelButton, {class: 'actions'});
		},

		// Given an array of names of types, return an array of all identifiers in the context metadata
		// that have that a matching type. If there are none, return an empty array. Items in the array will
		// be objects with name and value properties, where name is the display name of the type
		// and value is the actual field or function name.
		getContextCandidatesByType: function(typeNames) {
			var result = [],
				contextMetadata = this.getContextMetadata();

			for (var prop in contextMetadata) {
				var c = contextMetadata[prop];

				for (var i = 0; i < typeNames.length; i++) {
					if (c === typeNames[i]) {
						result.push({ name: prop, value: prop });
					}
				}
			}

			return result;
		},

		// Create markup for a field as defined by fieldDef, and which has the given current binding.
		// Each field is a div containing the name label, the binding mode and binding value.
		createPropertyField: function(fieldDef, currentBinding) {
			var labelMarkup = this.newEl('td', fieldDef.name, {class: 'field-name'});
			var sourceMarkup = this.generateSourceMarkup(fieldDef, currentBinding);
			var valueMarkup = this.generateValueMarkup(fieldDef, currentBinding);
			return this.newEl(
				'tr',
				labelMarkup + sourceMarkup + valueMarkup,
				{
					class: 'editor-field',
					'data-field-type': fieldDef.type,
					'data-field-name': fieldDef._propertyName
				});
		},

		generateSourceMarkup: function(fieldDef, currentBinding) {
			console.log('generating source markup for ', currentBinding);
			var currentBindingType = 'embedded';
			if (currentBinding && currentBinding.type) {
				currentBindingType = currentBinding.type;
			}

			var dropdown = '<select>';
			dropdown += this.newEl('option', 'embedded', currentBindingType === 'embedded' ? {selected: true} : {});
			dropdown += this.newEl('option', 'context', currentBindingType === 'context' ? {selected: true}: {});
			dropdown += '</select>';
			return this.newEl('td', dropdown, {class: 'field-source'});
		},

		generateValueMarkup: function(fieldDef, currentBinding) {
			return this.newEl('td', '', {class: 'field-value'});
		},

		// Invoked when the form is saved. This takes the selected field values and stores them back to the
		// component model. The saving is delegated on a field by field basis, so that new field implementations
		// can hook in without changing this.
		// If validation is performed, this is where it will happen. This function returns true if the form validates
		// successfully, false otherwise and errors would be highlighted on the form.
		saveForm: function() {
			var component = this.getEditingComponent();
			var metadata = this.getMetadataForComponent(component);

			for (var p in metadata.properties) {
				$field = $('.property-editor .editor-field[data-field-name="' + p + '"]', this);

				// Get the field's value. This uses the getBinding function which is overridden per
				// field type.
				var newBinding = $field.getBinding();

console.log('for field ', p, ' got new binding ', newBinding, ' to replace ', component.bindings[p]);
				// Store this into the value property.
				component.bindings[p] = newBinding;
			}

			console.log('after saving, component now looks like:', component);
			return true;
		},

		// Return the property metadata for a class. This is the properties object where the keys are the property names.
		getPropertiesForType: function(className) {
			return metadata.properties;
		},

		// When a property editor form is constructed, the field value placeholder divs are left empty.
		// This function iterates over the fields in the form after it's been injected, and calls 
		// updateValueEditor on each field. This will cause the field-specific implementation to display the
		// correct bound values for the field.
		updateFieldValues: function() {
			var component = this.getEditingComponent();
			var metadata = this.getMetadataForComponent(component);

			$('.editor-field', this).each(function() {
				var $field = $(this);
				var fieldName = $field.attr('data-field-name');
				var binding = component.bindings[fieldName];
				if (!binding) {
					// if for some reason this field has no binding in the layout, give it a binding
					binding = {
						type: 'embedded',
						value: null
					}
				}

				// get the field's updateValueEditor function to provide the markup
				var valueEditorMarkup = $field.getValueEditor(metadata.properties[fieldName], binding);

				$('.field-value', $field).html(valueEditorMarkup);
			});
		}

	});

	$('.NLEditor .property-editor .field-source').entwine({
		// When the field source of a field changes, update the value presentation
		onchange: function(e) {
			console.log(e);
			var $target = $(e.target), // the <select>
				valueEditorMarkup;

			var editor = this.closest('.NLEditor');
			var $field = this.closest('.editor-field');
			var fieldName = $field.attr('data-field-name');

			var newSource = $(e.target).val();

			// determine the property metadata and the current binding.
			var component = editor.getEditingComponent();
			var metadata = editor.getMetadataForComponent(component);

	console.log('field source component is ', component, fieldName);
			component.bindings[fieldName] = {
				type: newSource,
				value: null
			};

			// get the field's updateValueEditor function to provide the markup
			valueEditorMarkup = $field.getValueEditor(metadata.properties[fieldName], component.bindings[fieldName]);
console.log('valueEditorMarkup is:', valueEditorMarkup);
			$('.field-value', $field).html(valueEditorMarkup);
		}
	});

	// This implements the generic interface for field editors. These are expected to be overridden for each
	// type of field (typically a similar selector, but matching data-field-type value). These implement
	// dummy behaviours, and should not generally be called.
	$('.NLEditor .property-editor .editor-field').entwine({
		// Return the markup to inject into the .editor-field .field-value. Both the definition of the property,
		// as well as the bindings to display for the property, are passed in.
		getValueEditor: function(propertyDef, propertyBinding) {
			switch(propertyBinding.type) {
				case 'embedded':
					return this.getEmbeddedEditor(propertyDef, propertyBinding);
				case 'context':
					return this.getContextEditor(propertyDef, propertyBinding);
				default:
					return 'invalid binding type: ', propertyBinding.type;
			}
		},

		// Abstract implementation of embedded editor. This returns nothing; the subclass is expected to
		// implement this.
		getEmbeddedEditor: function(propertyDef, propertyBinding) {
			// no support for embedded editing for field type
			return '';
		},

		// Abstract implementation of context editor. This returns the generic context editor. Subclasses
		// can override, but default behaviour is to see a list of values in the context with the supported
		// data type.
		getContextEditor: function(propertyDef, propertyBinding) {
			var editor = this.closest('.NLEditor');

			if (!propertyDef.types) {
				propertyDef.types = propertyDef.type.split('|');
			}
			candidates = editor.getContextCandidatesByType(propertyDef.types);

			// Add an optional value at the start.
			candidates.unshift({ name: '- select -', value: null});

			// generate a <select> out of the items
			var s = '<select>';
			for (var i = 0; i < candidates.length; i++) {
				var c = candidates[i];
				var selected = '';
				if (c.value == propertyBinding.value) {
					selected = ' selected';
				}
				s += '<option value="' + c.value + '"' + selected + '>' + c.name + '</option>';
			}
			s += '</select>';
			return s;
		},

		// Return the current binding for the property from the form. This will contain 'type' and 'value' properties.
		// 'type' is one of 'embedded' or 'context'. The value representing is field specific, but needs to match the
		// rendering of the component in PHP.
		getBinding: function() {
			var $source = $('.field-source select', this),
				result = {
					type: $source.val()
				};

			switch (result.type) {
				case 'embedded':
					result.value = this.getEmbeddedValue();
					break;
				case 'context':
					result.value = this.getContextValue();
					break;
				default:
					// @todo handle error case better. Perhaps a 'none' for type.
					result.value = null;
					break;
			}

			return result;
		},

		// Get the value from the embedded value editor. Subclasses are expected to implement this if they implement
		// getEmbdeddedEditor.
		getEmbeddedValue: function() {
			return null;
		},

		// Get the value from the context editor. This matches the implementation of getContextEditor above. If subclasses
		// override getContextEditor, they should implement a matching getContextValue.
		getContextValue: function() {
			var $source = $('.field-value select', this);
			return $source.val();
		}
	});

	$('.NLEditor .property-editor .action-save').entwine({
		onclick: function() {
			var editor = this.closest('.NLEditor');

			// Tell the editor to save the selected form values back to the component.
			var ok = editor.saveForm();

			if (ok) {
				// Get the callback and invoke it, indicating that the model has been updated.
				var callback = editor.getEditingCallback();
				callback(true);
			}
		}
	});

	$('.NLEditor .property-editor .action-cancel').entwine({
		onclick: function() {
			var editor = this.closest('.NLEditor');

			// Get the callback and invoke it, indicating there have been no model updates.
			var callback = editor.getEditingCallback();
			callback(false);
		}
	});
})(jQuery);