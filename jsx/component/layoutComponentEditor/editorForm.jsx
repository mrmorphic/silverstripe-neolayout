/**
 * @file A sub-component of FieldEditor, responsible for saving and canceling changes.
 * @module FieldEditorForm
 * @requires module:react
 * @requires module:./editorFormRow
 */

'use strict';

var React = require('react'),
    EditorFormRow = require('./editorFormRow');

var EditorForm = React.createClass({

    propTypes: {
        layoutdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired,
        updateLayoutComponentData: React.PropTypes.func.isRequired,
        getLayoutComponentSchema: React.PropTypes.func.isRequired
    },

    /**
     * @func _createFormRows
     * @param {Object} schema
     * @param {Object} contextMetadata
     * @return A list of FieldEditorRow's.
     * @desc Create a FieldEditorRow for each binding type relating to the WorkspaceField.
     */
    _createFormRows: function (schema, contextMetadata) {
        var rows = [],
            schemaData = {},
            key = '',
            refName = '',
            i = 0,
            binding = {};

        for (key in schema.properties) {
            if (schema.properties.hasOwnProperty(key)) {
                refName = 'editorRow_' + i;

                // Check if the LayoutComponent has a binding relating to the current row.
                // Do this by checking if the schema's key exists in the binding.
                if (typeof this.props.layoutdata.bindings[key] !== 'undefined') {
                    binding = this.props.layoutdata.bindings[key];
                } else {
                    binding = { type: 'embedded', value: '' };
                }

                schemaData = {
                    name: schema.properties[key].name,
                    types: schema.properties[key].type,
                    key: key
                };

                rows.push(
                    <EditorFormRow
                        binding={binding}
                        schema={schemaData}
                        contextMetadata={contextMetadata}
                        key={i}
                        ref={refName} />
                );

                i += 1;
            }
        }

        return rows;
    },

    /**
     * @func _getRows
     * @return {Array}
     * @desc Gets the EditorFormRows belonging to the current EditorForm.
     */
    _getRows: function () {
        var key = '',
            rows = [];

        for (key in this.refs) {
            if (this.refs.hasOwnProperty(key) && key.indexOf('editorRow_') > -1) {
                rows.push(this.refs[key]);
            }
        }

        return rows;
    },

    /**
     * @func handleSave
     * @desc Handle saving updates to a LayoutComponent.
     * @todo Only save one binding (row).
     */
    handleSave: function () {
        var i = 0,
            rows = this._getRows(),
            binding = {};

        // Extract row data and save it.
        for (i; i < rows.length; i += 1) {
            binding[rows[i].getDOMNode().getAttribute('data-type')] = rows[i].state;
        }

        this.props.updateLayoutComponentData(this.props.layoutdata.id, binding);
        this.props.toggleModalEditor();
    },

    /**
     * @func handleCancel
     * @desc Handle canceling changes made in the editor.
     */
    handleCancel: function () {
        var i = 0,
            rows = this._getRows();

        // Reset each row's state
        for (i; i < rows.length; i += 1) {
            rows[i].replaceState(rows[i].getInitialState());
        }

        // Close the modal
        this.props.toggleModalEditor();
    },

    render: function () {
        var formRows = this._createFormRows(this.props.getLayoutComponentSchema(), this.props.metadata.context);

        return (
            <div className="field-editor-form">
                <div className="field-editor-rows">
                    {formRows}
                </div>
                <div className="field-editor-actions">
                    <button className="field-editor-action save" onClick={this.handleSave}>Save</button>
                    <button className="field-editor-action cancel" onClick={this.handleCancel}>Cancel</button>
                </div>
            </div>
        );
    }
});

module.exports = EditorForm;
