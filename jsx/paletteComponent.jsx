/**
 * @file A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.
 * @module PaletteComponent
 */

'use strict';

var React = require('react');

var PaletteComponent = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    /**
     * @func _handleDragStart
     * @desc Handle the drag event on PaletteField's
     */
    _handleDragStart: function (event) {
        var data = {
            componentType: "PaletteComponent",
            componentData: this.props.data
        };

        event.dataTransfer.setData('text', JSON.stringify(data));
    },

    render: function () {
        return (
            <div className="nl-component nl-palette-component" draggable="true" onDragStart={this._handleDragStart}>
                <p className="name">{this.props.data.name}</p>
                <p className="description">{this.props.data.description}</p>
            </div>
        );
    }
});

module.exports = PaletteComponent;
