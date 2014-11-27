/**
 * @file A sub-component of FieldEditorForm. Each row represents a field binding.
 * @module FieldEditorFormRow
 */

'use strict';

var React = require('react');

var FieldEditorFormRow = React.createClass({

    propTypes: {
        binding: React.PropTypes.object.isRequired,
        name: React.PropTypes.string.isRequired,
        dataTypes: React.PropTypes.string.isRequired,
        contextMetadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return JSON.parse(JSON.stringify(this.props.binding));
    },

    /**
     * @func getContextOptions
     * @return {Array}
     * @desc Generates a list of options to populate the value dropdown (when state.type === 'context').
     */
    getContextOptions: function () {
        var self = this;

        return this.props.dataTypes.split('|').map(function (dataType) {
            var i = 0,
                prop = '',
                options = [];

            for (prop in self.props.contextMetadata) {
                if (self.props.contextMetadata.hasOwnProperty(prop) &&
                    self.props.contextMetadata[prop] === dataType) {

                    options.push(
                        <option key={i}>{prop}</option>
                    );

                    i += 1;
                }
            }

            return options;
        });
    },

    /**
     * @func handleValueChange
     * @param {Object} event
     * @desc Event handler for changes triggered by the value input.
     */
    handleValueChange: function (event) {
        this.setState({ value: event.target.value });
    },

    /**
     * @func getInputTypes
     * @return {Object}
     * @desc Generates the input field bound to the state's `value` property.
     */
    getTypeInputs: function () {
        var typeInput = null,
            contextOptions = null;

        if (this.state.type === 'context') {
            contextOptions = this.getContextOptions();

            typeInput = (
                <select className="field-editor-field" onChange={this.handleValueChange} value={this.state.value}>
                    {contextOptions}
                </select>
            );
        } else if (this.state.type === 'embedded') {
            typeInput = (
                <input
                    className="field-editor-field"
                    type="text" onChange={this.handleValueChange}
                    value={this.state.value} />
            );
        }

        return typeInput;
    },

    /**
     * @func handleTypeChange
     * @param {Object} event
     * @desc Event handler for changes triggered by the type dropdown. Switching between context and embedded.
     */
    handleTypeChange: function (event) {
        // As well as setting the type, we also have to update the value.
        // Clear the value, unless we're changing back to the initial type (context / embedded),
        // in which case the value should be what we initially set.

        var newType = event.target.value.toLowerCase(),
            newValue = newType !== this.props.binding.type ? '' : this.props.binding.value;

        this.setState({
            type: newType,
            value: newValue
        });
    },

    render: function () {
        var typeInputs = this.getTypeInputs();

        return (
            <div className="field-editor-row">
                <label>{this.props.name}</label>
                <select className="field-editor-field" onChange={this.handleTypeChange} value={this.state.type}>
                    <option value="context">Context</option>
                    <option value="embedded">Embedded</option>
                </select>
                {typeInputs}
            </div>
        );
    }
});

module.exports = FieldEditorFormRow;
