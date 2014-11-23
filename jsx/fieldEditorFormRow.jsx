'use strict';

var React = require('react'),
    $ = require('jquery');

var FieldEditorFormRow = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        dataTypes: React.PropTypes.string.isRequired,
        contextMetadata: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            dataSource: 'Context',
            contextDataType: ''
        };
    },
    getContextOptions: function () {
        var self = this;

        return this.props.dataTypes.split('|').map(function (dataType) {
            var i = 0,
                options = [];

            $.each(self.props.contextMetadata, function (key, value) {
                if (value === dataType) {
                    options.push(
                        <option key={i}>{key}</option>
                    );

                    i += 1;
                }
            });

            return options;
        });
    },
    handleContextDataTypeChange: function (event) {
        this.setState({ contextDataType: event.target.value });
    },
    getDataSourceInputs: function () {
        var dataSourceInput = null,
            contextOptions = null;

        if (this.state.dataSource === 'Context') {
            contextOptions = this.getContextOptions();

            dataSourceInput = (
                <select className="field-editor-field" onChange={this.handleContextDataTypeChange} value={this.state.contextDataType}>
                    {contextOptions}
                </select>
            );
        } else {
            dataSourceInput = (
                <input className="field-editor-field"></input>
            );
        }

        return dataSourceInput;
        
    },
    handleContextChange: function (event) {
        this.setState({ dataSource: event.target.value });
    },
    render: function () {
        var dataSourceInputs = this.getDataSourceInputs();

        return (
            <div className="field-editor-row">
                <label>{this.props.name}</label>
                <select className="field-editor-field" onChange={this.handleContextChange} value={this.state.dataSource}>
                    <option>Context</option>
                    <option>Embedded</option>
                </select>
                {dataSourceInputs}
            </div>
        );
    }
});

module.exports = FieldEditorFormRow;
