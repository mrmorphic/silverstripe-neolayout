'use strict';

var React = require('react'),
    $ = require('jquery'),
    util = require('./util');

var Toolbar = React.createClass({
    getInitialState: function () {
        return { editing: false };
    },
    getCssClasses: function (requiredClasses) {
        return this.state.editing === true ? requiredClasses : requiredClasses + ' hide';
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

        $.each(schema.properties, function () {
            var contextOptions = this.type.split('|').map(function (dataType) {
                var options = [];

                $.each(contextMetadata, function (key, value) {
                    if (value === dataType) {
                        options.push((
                            <option>{key}</option>
                        ));
                    }
                });

                return options;
            });

            rows.push((
                <div className="field-editor-row">
                    <label>{this.name}</label>
                    <select className="field-editor-field context-selector" onChange={self.toggleContextInput}>
                        <option>Context</option>
                        <option>Embedded</option>
                    </select>
                    <select className="firld-editor-field field-value-input data-type-selector">
                        {contextOptions}
                    </select>
                    <input className="field-editor-field field-value-input embedded-input hide"></input>
                </div>
            ));
        });

        return rows;
    },
    toggleModalEditor: function () {
        this.setState({ editing: !this.state.editing });
    },
    render: function () {
        var fieldSchema = util.getFieldSchema(this.props.data.ClassName, this.props.metadata.components),
            formRows = this.createFormRows(fieldSchema, this.props.metadata.context);

        if (typeof this.props.data.bindings !== 'undefined') {
            $.each(this.props.data.bindings, function () {
                // @todo What do we do with bindings?
            });
        }

        return (
            <div className="nl-toolbar">
                <button type="button" onClick={this.toggleModalEditor}>Edit</button>
                <button type="button">Remove</button>
                <div className={this.getCssClasses('nl-modal-editor')}>
                    <h3>{this.props.data.ClassName}</h3>
                    <div className="field-editor-form">
                        <div className="field-editor-rows">
                            {formRows}
                        </div>
                        <div className="field-editor-actions">
                            <button className="field-editor-action save">Save</button>
                            <button className="field-editor-action cancel" onClick={this.toggleModalEditor}>Cancel</button>
                        </div>
                    </div>
                </div>
                <div className={this.getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    }
});

module.exports = Toolbar;
