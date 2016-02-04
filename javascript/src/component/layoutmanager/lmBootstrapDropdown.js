/**
 * @file A sub-component of EditorForm. An EditorFormRow represents a LayoutComponent binding.
 * @module EditorFormRow
 * @requires module:react
 */

'use strict';

var React = require('react');

var LMBootstrapDropdown = React.createClass({

    propTypes: {
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        options: React.PropTypes.array.isRequired,
        propEditor: React.PropTypes.array.isRequired,
        property: React.PropTypes.string.isRequired
    },

    _handleValueChange: function(event) {
        var o = {};
        o[this.props.property] = event.target.value;
        this.props.propEditor.setState(o);
    },

    render: function () {
        return (
            <div className="lm-col-width-row">
                <label>{this.props.label}</label>
                <select onChange={this._handleValueChange} value={this.props.value}>
                    {this.props.options}
                </select>
            </div>
        );
    }
});

module.exports = LMBootstrapDropdown;
