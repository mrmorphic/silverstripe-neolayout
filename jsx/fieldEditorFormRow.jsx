/**
 * @file A sub-component of FieldEditorForm. Each row represents a field binding.
 * @module FieldEditorFormRow
 */

'use strict';

var React = require('react');

var FieldEditorFormRow = React.createClass({

    propTypes: {
        binding: React.PropTypes.object.isRequired,
        schema: React.PropTypes.object.isRequired,
        contextMetadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return JSON.parse(JSON.stringify(this.props.binding));
    },

    /**
     * @func _getContextOptions
     * @return {Array}
     * @desc Generates a list of options to populate the value dropdown (when state.type === 'context').
     */
    _getContextOptions: function () {
        var self = this;

        return this.props.schema.types.split('|').map(function (type) {
            var i = 0,
                prop = '',
                options = [];

            for (prop in self.props.contextMetadata) {
                if (self.props.contextMetadata.hasOwnProperty(prop) &&
                    self.props.contextMetadata[prop] === type) {

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
            contextOptions = null,
            contextValue = null,
            contextOptions = this._getContextOptions();

        if (this.state.type === 'context' && contextOptions[0].length > 0) {
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
        var newType = event.target.value.toLowerCase(),
            newValue = '',
            contextOptions = this._getContextOptions();

        // If we're changing to a type that's not initial type.
        if (newType !== this.props.binding.type) {
            // The new type is not the initial type.
            // If the new type is `context` then select the first option,
            // otherwise set an empty string, for embedded.
            if (newType === 'context' && contextOptions[0].length > 0) {
                newValue = contextOptions[0][0].props.children.toString();
            } else {
                newValue = '';
            }
        } else {
            // Set the value back to the initial value.
            newValue = this.props.binding.value;
        }

        this.setState({
            type: newType,
            value: newValue
        });
    },

    render: function () {
        var typeInputs = this.getTypeInputs();

        return (
            <div className="field-editor-row" data-type={this.props.schema.key}>
                <label>{this.props.schema.name}</label>
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
