/**
 * @file Wrapper component for the available fields.
 * @module Palette
 * @requires module:react
 * @requires module:./paletteComponent
 */

'use strict';

var React = require('react'),
    PaletteComponent = require('./paletteComponent');

var Palette = React.createClass({

    propTypes: {
        metadata: React.PropTypes.object.isRequired
    },

    render: function () {
        var availableFields = this.props.metadata.components.map(function (field, i) {
            return (
                <PaletteComponent className="nl-palette-component" layoutdata={field} key={i} />
            );
        });

        return (
            <div className="nl-palette">
                {availableFields}
            </div>
        );
    }
});

module.exports = Palette;