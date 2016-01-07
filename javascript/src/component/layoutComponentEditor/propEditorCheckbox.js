/**
 * @file A sub-component of EditorForm. An EditorFormRow represents a LayoutComponent binding.
 * @module EditorFormRow
 * @requires module:react
 */

'use strict';

var React = require('react');

var PropEditorCheckbox = React.createClass({

    propTypes: {
        className: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.object.isRequired,
        schema: React.PropTypes.object.isRequired
    },

    // getInitialState: function () {
    //     // Create a new object so unsaved changes don't trigger a re-render.
    //     return JSON.parse(JSON.stringify(this.props.binding));
    // },

    /**
     * @func _handleValueChange
     * @param {Object} event
     * @desc Event handler for changes triggered by the value input.
     */
    // _handleValueChange: function (event) {
    //     this.setState({ value: event.target.value });
    // },

    render: function () {
        return (
            <input
                className={this.props.className}
                type="numeric" onChange={this.props.onChange}
                value={this.props.value} />
        );
    }
});

module.exports = PropEditorCheckbox;
