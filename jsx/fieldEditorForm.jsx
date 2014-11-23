'use strict';

var React = require('react'),
    $ = require('jquery'),
    FieldEditorFormRow = require('./fieldEditorFormRow');

var FieldEditorForm = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired
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
            i = 0;

        $.each(schema.properties, function () {
            var refName = 'fieldEditorRow_' + i;

            rows.push(
                <FieldEditorFormRow name={this.name} dataTypes={this.type} contextMetadata={contextMetadata} key={i} ref={refName} />
            );

            i += 1;
        });

        return rows;
    },
    handleSave: function () {
        this.props.toggleModalEditor();
    },
    handleCancel: function () {
        // Reset each row's state
        $.each(this.refs, function (key, ref) {
            if (key.indexOf('fieldEditorRow') > -1) {
                this.replaceState(this.getInitialState());
            }
        });

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
