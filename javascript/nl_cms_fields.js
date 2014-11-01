(function($) {

	/**
	 * nl_cms_fields.js handles field-type specific logic for the property editor. For project-specific
	 * fields, these can be handled in the same way, and also loaded into the CMS.
	 */

	/*******
	 * Varchar value handling
	 */
	$('.NLEditor .property-editor .editor-field[data-field-type=Varchar]').entwine({
		getEmbeddedEditor: function(propertyDef, propertyBinding) {
			var editor = this.closest('.NLEditor');

			// embedded literal value
			return editor.newEl(
				'input',
				'',
				{
					type: 'text',
					value: propertyBinding.value ? propertyBinding.value : ''
				}
			);
		},

		getEmbeddedValue: function() {
			return $('input', this).val();
		}
	});

	/*******
	 * Text value handling
	 */
	$('.NLEditor .property-editor .editor-field[data-field-type=Text]').entwine({
		getEmbeddedEditor: function(propertyDef, propertyBinding) {
			var editor = this.closest('.NLEditor');

			// literal
			return editor.newEl(
				'textarea',
				propertyBinding.value ? propertyBinding.value : '',
				{
					lines: 2,
					cols: 40 
				}
			);
		},

		getEmbeddedValue: function() {
			return $('textarea', this).val();
		}
	});

	/*******
	 * Image field handling
	 */
})(jQuery);