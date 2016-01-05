/**
 * @file A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.
 * @module PaletteComponent
 * @requires module:react
 * @requires mixin:../mixin/dragAndDrop
 */

'use strict';

var React = require('react'),
    dragAndDropMixin = require('../../mixin/dragAndDrop'),
    MetadataStore = require('../../store/MetadataStore');

var PaletteComponent = React.createClass({

    propTypes: {
        componentdata: React.PropTypes.object.isRequired
    },

    mixins: [dragAndDropMixin],

    render: function () {
        // we're passed the component prototype object, we also look up metadata for the component.
        var componentPrototype = this.props.componentdata,
            componentMetadata = MetadataStore.getComponentByType(componentPrototype.componentType);

        var iconClass,
            title,
            description,
            icon;

        if (componentMetadata === void 0) {
            iconClass = '';
        } else {
            iconClass = 'component-icon icon-' + componentMetadata.name.replace(/ /g,'');
        }

        if (componentPrototype._title) {
            title = componentPrototype._title;
        } else {
            title = componentMetadata.name;
        }

        if (componentPrototype._description) {
            description = componentType._description;
        } else {
            description = componentMetadata.description;
        }

        if (componentPrototype._thumbnailUrl) {
            icon = (
                <img src={componentPrototype._thumbnailUrl} />
            );
        } else {
            icon = (
                <span className={iconClass}></span>
            );
        }

        return (
            <div
                className="nl-component nl-palette-component"
                draggable="true"
                onDragStart={this._handleDragStart}
                title={description}>

                <div className="nl-icon-container">
                    {icon}
                </div>
                <div className="nl-component-title">{title}</div>
            </div>
        );
    }
});

module.exports = PaletteComponent;
