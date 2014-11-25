'use strict';

var React = require('react'),
    FieldEditorFormRow = require('./fieldEditorFormRow');

var FieldEditorForm = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired,
        updateFieldBindings: React.PropTypes.func.isRequired
    },
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
    createFormRows: function (schema, contextMetadata) {
        var rows = [],
            prop = '',
            refName = '',
            i = 0;

        for (prop in schema.properties) {
            if (schema.properties.hasOwnProperty(prop)) {
                refName = 'fieldEditorRow_' + i;

                rows.push(
                    <FieldEditorFormRow
                        name={schema.properties[prop].name}
                        dataTypes={schema.properties[prop].type}
                        contextMetadata={contextMetadata}
                        key={i}
                        ref={refName} />
                );

                i += 1;
            }
        }

        return rows;
    },
    handleSave: function () {
        this.props.updateFieldBindings({ foo: 'bar' });
        this.props.toggleModalEditor();
    },
    handleCancel: function () {
        for (var prop in this.refs) {
            if (this.refs.hasOwnProperty(prop) && this.refs[prop].indexOf('fieldEditorRow') > -1) {
                this.replaceState(this.getInitialState());
            }
        }

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
