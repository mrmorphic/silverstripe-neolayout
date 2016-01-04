/**
 * Palette tab (generic)
 */

'use strict';

var React = require('react'),
    PaletteComponent = require('./paletteComponent');

// PaletteTabGeneric renders a list of component instances. These are provided
// in tabdef.items. Each item is an instance or prototype of a component, that can be dragged onto
// the layout. Each prototype typically has one or more bindings already present.
var PaletteTabGeneric = React.createClass({

    propTypes: {
        tabdef: React.PropTypes.object.isRequired,
        visible: React.PropTypes.bool.isRequired
    },

    // A generic tab is just a div that renders all the items as PaletteComponents.
    render: function () {
        var c = 'hidden';
        if (this.props.visible) {
            c = '';
        }

        var components = [],
            tabItems = this.props.tabdef.items;

        for (var i = 0; i < tabItems.length; i++) {
            var item = tabItems[i];
            components.push(
                <PaletteComponent componentdata={item} key={i} />
            );
        }

        return (
            <div className={c}>
                {components}
            </div>
        );
    }
});

module.exports = PaletteTabGeneric;
