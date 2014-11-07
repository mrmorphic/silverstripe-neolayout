'use strict';

var React = require('react');

var PaletteField = React.createClass({
    render: function () {
        return (
            <div className="nl-component nl-palette-field">
                <p><strong>{this.props.data.name}</strong></p>
                <p>{this.props.data.description}</p>
            </div>
        );
    }
});

module.exports = PaletteField;
