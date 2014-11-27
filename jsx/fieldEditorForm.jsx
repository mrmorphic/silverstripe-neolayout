/**
 * @file A sub-component of FieldEditor, responsible for saving and canceling changes.
 * @module FieldEditorForm
 */

'use strict';

var React = require('react'),
    FieldEditorFormRow = require('./fieldEditorFormRow');

var FieldEditorForm = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired,
        updateFieldData: React.PropTypes.func.isRequired
    },

    /**
     * @func getFieldSchema
     * @param {String} componentType The ClassName of a WorkspaceField.
     * @param {Array} schemas Schemas defined by metadata.components.
     * @return {Array} The schemas relating to a WorkspaceField.
     * @desc Get a list a schemas which apply to a Workspace field.
     */
    getFieldSchema: function (componentType, schemas) {
        var i = 0;

        // Don't compare undefined to schema[i].componentType.
        // If schema[i].componentType is undefined, it will match.
        if (typeof componentType !== 'string') {
            throw new Error('componentType should be a string, you passed typeof ' + typeof componentType);
        }

        for (i; i < schemas.length; i += 1) {
            if (schemas[i].componentType === componentType) {
                return schemas[i];
            }
        }
    },

    /**
     * @func createFormRows
     * @param {Object} schema
     * @param {Object} contextMetadata
     * @return A list of FieldEditorRow's.
     * @desc Get a FieldEditorRow for each schema relating to the WorkspaceField.
     */
    createFormRows: function (schema, contextMetadata) {
        var rows = [],
            key = '',
            refName = '',
            i = 0,
            binding = { type: '', value: '' };

        for (key in schema.properties) {
            if (schema.properties.hasOwnProperty(key)) {
                refName = 'fieldEditorRow_' + i;

                // Check if the field has a binding relating to the current row.
                // Do this by checking if the schema's key exists in the binding.
                if (typeof this.props.data.bindings[key] !== 'undefined') {
                    binding = this.props.data.bindings[key];
                }

                rows.push(
                    <FieldEditorFormRow
                        binding={binding}
                        name={schema.properties[key].name}
                        dataTypes={schema.properties[key].type}
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
     * @func handleSave
     * @desc Handle saving updates to a WorkspaceField.
     */
    handleSave: function () {
        this.props.updateFieldData({ foo: 'bar' });
        this.props.toggleModalEditor();
    },

    /**
     * @func handleCancel
     * @desc Handle canceling changes made in the editor.
     */
    handleCancel: function () {
        this.props.toggleModalEditor();
    },

    render: function () {
        var fieldSchema = this.getFieldSchema(this.props.data.ClassName, this.props.metadata.components),
            formRows = this.createFormRows(fieldSchema, this.props.metadata.context);

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

module.exports = FieldEditorForm;
