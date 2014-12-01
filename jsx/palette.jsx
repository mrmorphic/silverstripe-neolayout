/**
 * @file Wrapper component for the available fields.
 * @module Palette
 */

'use strict';

var React = require('react'),
    PaletteField = require('./paletteField');

var Palette = React.createClass({
    propTypes: {
        metadata: React.PropTypes.object.isRequired
    },
    render: function () {
        var availableFields = this.props.metadata.components.map(function (field, i) {
            return (
                <PaletteField data={field} key={i} />
            );
        });

        return (
            <div className="nl-pallete">
                {availableFields}
            </div>
        );
    }
});

module.exports = Palette;
