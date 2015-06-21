/**
 * @file A sub-component of FieldEditor, responsible for saving and canceling changes.
 * @module FieldEditorForm
 * @requires module:react
 * @requires module:./editorFormRow
 * @requires module:../../action/ComponentActions
 */

'use strict';

var React = require('react'),
    EditorFormRow = require('./editorFormRow'),
    ComponentActions = require('../../action/ComponentActions');

var EditorForm = React.createClass({

    propTypes: {
        componentdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired
    },

    render: function () {
        var formRows = this._createFormRows(this._getComponentSchema(), this.props.metadata.context);

        return (
            <div className="field-editor-form">
                <div className="field-editor-rows">
                    {formRows}
                </div>
                <div className="field-editor-actions">
                    <button className="field-editor-action save" onClick={this._handleSaveButtonClick}>Save</button>
                    <button className="field-editor-action cancel" onClick={this._handleCancelButtonClick}>Cancel</button>
                </div>
            </div>
        );
    },

    /**
     * @func _createFormRows
     * @param {object} schema
     * @param {object} contextMetadata
     * @return {array} - A list of FieldEditorRow's.
     * @desc Create a FieldEditorRow for each binding type relating to the LayoutComponent.
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
                if (this.props.componentdata.bindings[key] !== void 0) {
                    binding = this.props.componentdata.bindings[key];
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
     * @func _getComponentSchema
     * @return {Array} The schemas relating to a LayoutComponent.
     * @desc Get the schema for the LayoutComponent.
     */
    _getComponentSchema: function () {
        var schema = null,
            i = 0;

        for (i; i < this.props.metadata.components.length; i += 1) {
            if (this.props.metadata.components[i].componentType === this.props.componentdata.ClassName) {
                schema = this.props.metadata.components[i];
                break;
            }
        }

        return schema;
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
     * @func _handleSaveButtonClick
     * @desc Handle saving updates to a LayoutComponent.
     * @todo Only save one binding (row).
     */
    _handleSaveButtonClick: function () {
        var i = 0,
            rows = this._getRows(),
            binding = {};

        // Extract row data and save it.
        for (i; i < rows.length; i += 1) {
            // TODO: Only extract values which have been updated.
            binding[rows[i].getDOMNode().getAttribute('data-type')] = rows[i].state;
        }

        ComponentActions.update(this.props.componentdata.id, 'bindings', binding);

        this.props.toggleModalEditor();
    },

    /**
     * @func _handleCancelButtonClick
     * @desc Handle canceling changes made in the editor.
     */
    _handleCancelButtonClick: function () {
        var i = 0,
            rows = this._getRows();

        // Reset each row's state
        for (i; i < rows.length; i += 1) {
            rows[i].replaceState(rows[i].getInitialState());
        }

        // Close the modal
        this.props.toggleModalEditor();
    }
});

module.exports = EditorForm;
