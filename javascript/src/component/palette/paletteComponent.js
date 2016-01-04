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
            componentMetadata = MetadataStore.getComponentByType(componentPrototype.ClassName);

        var iconClass,
            title;

        if (componentMetadata === void 0) {
            iconClass = '';
        } else {
            iconClass = 'component-icon icon-' + componentMetadata.name.replace(/ /g,'');
        }

        if (componentPrototype.title) {
            title = componentPrototype.title;
        } else {
            title = componentMetadata.name;
        }

        return (
            <div
                className="nl-component nl-palette-component"
                draggable="true"
                onDragStart={this._handleDragStart}
                title={componentMetadata.description}>

                <div className="nl-icon-container">
                    <span className={iconClass}></span>
                </div>
                <div className="nl-component-title">{title}</div>
            </div>
        );
    }
});

module.exports = PaletteComponent;
