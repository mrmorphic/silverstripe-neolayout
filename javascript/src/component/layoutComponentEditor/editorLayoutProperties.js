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
    ComponentActions = require('../../action/ComponentActions'),
    MetadataStore = require('../../store/MetadataStore'),
    LayoutManager = require('../layoutManager');

var EditorLayoutProperties = React.createClass({

    propTypes: {
        componentdata: React.PropTypes.object.isRequired
    },

    render: function () {
        var componentMetadata = MetadataStore.getComponentByType(this.props.componentdata.componentType),
            // formRows = this._createFormRows(componentMetadata, this.props.contextMetadata),
            c = 'field-editor-layout-rows';

        if (!this.props.visible) {
            c += ' hidden';
        }

        var editor = LayoutManager.getPropertyEditor(this.props.componentdata);

        return (
            <div className={c}>
                {editor}
            </div>
        );
    },

    saveChanges: function() {

    },

    cancelChanges: function() {

    }

    // /**
    //  * @func _createFormRows
    //  * @param {object} schema
    //  * @param {object} contextMetadata
    //  * @return {array} - A list of FieldEditorRow's.
    //  * @desc Create a FieldEditorRow for each binding type relating to the LayoutComponent.
    //  */
    // _createFormRows: function (schema, contextMetadata) {
    //     var rows = [],
    //         schemaData = {},
    //         key = '',
    //         refName = '',
    //         i = 0,
    //         binding = {};

    //     for (key in schema.properties) {
    //         if (schema.properties.hasOwnProperty(key)) {
    //             refName = 'editorRow_' + i;

    //             // Check if the LayoutComponent has a binding relating to the current row.
    //             // Do this by checking if the schema's key exists in the binding.
    //             if (this.props.componentdata.bindings[key] !== void 0) {
    //                 binding = this.props.componentdata.bindings[key];
    //             } else {
    //                 binding = { type: 'embedded', value: '' };
    //             }

    //             schemaData = {
    //                 name: schema.properties[key].name,
    //                 types: schema.properties[key].type,
    //                 key: key
    //             };

    //             rows.push(
    //                 <EditorFormRow
    //                     binding={binding}
    //                     schema={schemaData}
    //                     contextMetadata={contextMetadata}
    //                     key={i}
    //                     ref={refName} />
    //             );

    //             i += 1;
    //         }
    //     }

    //     return rows;
    // },

    // /**
    //  * @func _getRows
    //  * @return {Array}
    //  * @desc Gets the EditorFormRows belonging to the current EditorForm.
    //  */
    // _getRows: function () {
    //     var key = '',
    //         rows = [];

    //     for (key in this.refs) {
    //         if (this.refs.hasOwnProperty(key) && key.indexOf('editorRow_') > -1) {
    //             rows.push(this.refs[key]);
    //         }
    //     }

    //     return rows;
    // }
});

module.exports = EditorLayoutProperties;
