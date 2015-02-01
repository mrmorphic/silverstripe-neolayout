/**
 * @file A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.
 * @module PaletteComponent
 * @requires module:react
 * @requires mixin:../mixin/dragAndDrop
 */

'use strict';

var React = require('react'),
    dragAndDropMixin = require('../mixin/dragAndDrop');

var PaletteComponent = React.createClass({

    propTypes: {
        layoutdata: React.PropTypes.object.isRequired
    },

    mixins: [dragAndDropMixin],

    render: function () {
        return (
            <div className="nl-component nl-palette-component" draggable="true" onDragStart={this._handleDragStart}>
                <p className="name">{this.props.layoutdata.name}</p>
                <p className="description">{this.props.layoutdata.description}</p>
            </div>
        );
    }
});

module.exports = PaletteComponent;
