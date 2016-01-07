/**
 * @file A sub-component of EditorForm. An EditorFormRow represents a LayoutComponent binding.
 * @module EditorFormRow
 * @requires module:react
 */

'use strict';

var React = require('react');

var PropEditorDropdown = React.createClass({

    propTypes: {
        className: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.object.isRequired,
        schema: React.PropTypes.object.isRequired
    },

    render: function () {
        var options = this._getOptions();

        return (
            <select className={this.props.className}
                    onChange={this.props.onChange}
                    value={this.props.value}>
                {options}
            </select>
        );
    },

    // Return an array of <option> elements for the select. This is derived from the enum declaration, which we parse for
    // values and default.
    _getOptions: function() {
        var e = this._parseEnumClause(this.props.schema.types),
            result = [];

        for (var i = 0; i < e.values.length; i++) {
            result.push(
                <option key={i}>{e.values[i]}</option>
            )
        }

        return result;
    },

    _parseEnumClause: function(s) {
        // strip the Enum( ... ) wrapper
        s = s.substr(5);
        s = s.substr(0, s.length-1);

        // get the value list and the default.
        var parts = s.split("','"), // part[0] is value list, part[1] is default, with single quotes.
            result = {
                values: [],
                defaultValue: null
            },
            v = parts[0].split(',');

console.log('parts:', parts);
console.log('v:', v);
        for (var i=0; i < v.length; i++) {
            result.values.push(v[i].replace("'", ""));
        }

        if (parts.length > 1) {
            result.defaultValue = parts[1].replace("'", "");
        }

console.log('result:', result);
        return result;
    }
});

module.exports = PropEditorDropdown;
