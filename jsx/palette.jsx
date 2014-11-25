'use strict';

var React = require('react'),
    PaletteField = require('./paletteField');

var Palette = React.createClass({
    propTypes: {
        metadata: React.PropTypes.object.isRequired
    },
    render: function () {
        var availableComponents = this.props.metadata.components.map(function (component, i) {
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
