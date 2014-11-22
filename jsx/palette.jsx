'use strict';

var React = require('react'),
    $ = require('jquery'),
    PaletteField = require('./paletteField');

var Palette = React.createClass({
    render: function () {
        var availableComponents = this.props.data.components.map(function (component, i) {
            return (
                <PaletteField data={component} key={i} />
            );
        });

        return (
            <div className="nl-pallete">
                {availableComponents}
            </div>
        );
    }
});

module.exports = Palette;
