/**
 * @file A sub-component of EditorForm. An EditorFormRow represents a LayoutComponent binding.
 * @module EditorFormRow
 * @requires module:react
 */

'use strict';

var React = require('react'),
    PropEditorText = require('./propEditorText'),
    PropEditorNumeric = require('./propEditorNumeric'),
    PropEditorDropdown = require('./propEditorDropdown'),
    PropEditorCheckbox = require('./propEditorCheckbox');

// An ordered list of property editor rules. Each rule consists of a matching function
// an an object that determines what is to be created if the rule matches.
var _editorRules = [
    {
        // Enum fields use a drop down
        matches: function(type) {
            return (type.types.indexOf('Enum(') >= 0);
        },
        editor: {
            editorClass: PropEditorDropdown
        }
    },
    {
        // Integer uses a numeric field, which limits to numeric fields
        matches: function(type) {
            return (type.types == 'Int');
        },
        editor: {
            editorClass: PropEditorNumeric
        }
    },
    {
        // Boolean uses a checkbox.
        matches: function(type) {
            return false;
        },
        editor: {
            editorClass: PropEditorCheckbox
        }
    },
    {
        // Varchar
        matches: function(type) {
            return false;
        },
        editor: {
            editorClass: PropEditorText
        }
    }
];

var EditorFormRow = React.createClass({

    propTypes: {
        binding: React.PropTypes.object.isRequired,
        schema: React.PropTypes.object.isRequired,
        contextMetadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        // Create a new object so unsaved changes don't trigger a re-render.
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
     * @func _handleValueChange
     * @param {Object} event
     * @desc Event handler for changes triggered by the value input.
     */
    _handleValueChange: function (event) {
        this.setState({ value: event.target.value });
    },

    /**
     * @func _getInputTypes
     * @return {Object}
     * @desc Generates the input field bound to the state's `value` property.
     */
    _getTypeInputs: function () {
        var typeInput = null,
            contextOptions = null,
            contextValue = null,
            contextOptions = this._getContextOptions();

        if (this.state.type === 'context' && contextOptions[0].length > 0) {
            typeInput = (
                <select className="field-editor-field" onChange={this._handleValueChange} value={this.state.value}>
                    {contextOptions}
                </select>
            );
        } else if (this.state.type === 'embedded') {
            typeInput = this._getEmbeddedEditor();
            // typeInput = (
            //     <input
            //         className="field-editor-field"
            //         type="text" onChange={this._handleValueChange}
            //         value={this.state.value} />
            // );
        }

        return typeInput;
    },

    // There are different editors available for embedded values, based generally on data type. This function
    // returns one based on properties of the field. The default is a simple text editor. The idea longer term
    // is that there is an extendable registry of editors, so that new modules can provide new data types and
    // register the editor. While registration is not implemented yet, it should be easy to add, with the selection
    // happening in this function. All we do here is use _editorRules
    _getEmbeddedEditor: function() {
        var editorClass = null;

        for (var i = 0; i < _editorRules.length; i++) {
            var rule = _editorRules[i];
            if (rule.matches(this.props.schema)) {
                console.log('found matching rule with ', this.props.schema);
                editorClass = rule.editor.editorClass;
            }
        }

        if (!editorClass) {
            editorClass = PropEditorText;
        }

        return React.createElement(editorClass, {
            className: 'field-editor-field',
            onChange: this._handleValueChange,
            value: this.state.value,
            schema: this.props.schema
        });
    },

    /**
     * @func _handleTypeChange
     * @param {Object} event
     * @desc Event handler for changes triggered by the type dropdown. Switching between context and embedded.
     */
    _handleTypeChange: function (event) {
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
        var typeInputs = this._getTypeInputs();

        return (
            <div className="field-editor-row" data-type={this.props.schema.key}>
                <label>{this.props.schema.name}</label>
                <select className="field-editor-field" onChange={this._handleTypeChange} value={this.state.type}>
                    <option value="context">From page</option>
                    <option value="embedded">Entered value</option>
                </select>
                {typeInputs}
            </div>
        );
    }
});

module.exports = EditorFormRow;
