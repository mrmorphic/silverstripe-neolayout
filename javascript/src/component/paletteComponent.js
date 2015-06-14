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
        componentdata: React.PropTypes.object.isRequired
    },

    mixins: [dragAndDropMixin],

    render: function () {
        var iconClass;

        if (this.props.componentdata.name === void 0) {
            iconClass = '';
        } else {
            iconClass = 'component-icon icon-' + this.props.componentdata.name.replace(/ /g,'');
        }

        return (
            <div
                className="nl-component nl-palette-component"
                draggable="true"
                onDragStart={this._handleDragStart}
                title={this.props.componentdata.description}>

                <span className={iconClass}></span>
            </div>
        );
    }
});

module.exports = PaletteComponent;
