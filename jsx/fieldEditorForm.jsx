'use strict';

var React = require('react'),
    $ = require('jquery');

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
    toggleContextInput: function (event) {
        var $row = $(event.target).closest('.field-editor-row'),
            contextValue = $row.find('.context-selector').val();

        $row.find('.field-value-input').addClass('hide');

        switch(contextValue) {
            case 'Context':
                $row.find('.data-type-selector').removeClass('hide');
                break;
            case 'Embedded':
                $row.find('.embedded-input').removeClass('hide');
                break;
        }
    },
    createFormRows: function (schema, contextMetadata) {
        var self = this,
            rows = [];

        $.each(schema.properties, function (index, prop) {
            var contextOptions = this.type.split('|').map(function (dataType) {
                var i = 0,
                    options = [];

                $.each(contextMetadata, function (key, value) {
                    i += 1;

                    if (value === dataType) {
                        options.push(
                            <option key={i}>{key}</option>
                        );
                    }
                });

                return options;
            });

            rows.push(
                <div className="field-editor-row" key={index}>
                    <label>{prop.name}</label>
                    <select className="field-editor-field context-selector" onChange={self.toggleContextInput}>
                        <option>Context</option>
                        <option>Embedded</option>
                    </select>
                    <select className="field-editor-field field-value-input data-type-selector">
                        {contextOptions}
                    </select>
                    <input className="field-editor-field field-value-input embedded-input hide"></input>
                </div>
            );
        });

        return rows;
    },
    handleSave: function () {
        console.log(this);
        this.props.toggleModalEditor();
    },
    handleCancel: function () {
        console.log(this);
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
