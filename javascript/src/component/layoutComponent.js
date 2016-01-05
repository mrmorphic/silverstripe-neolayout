/**
 * @file The core component used to create layouts.
 * @module LayoutComponent
 * @requires module:react
 * @requires module:./layoutComponentEditor/editor
 * @requires mixin:../mixin/dragAndDrop
 * @requires module:../store/ComponentStore
 */

'use strict';

var React = require('react'),
    LayoutComponentEditor = require('./layoutComponentEditor/editor'),
    dragAndDropMixin = require('../mixin/dragAndDrop'),
    ComponentStore = require('../store/ComponentStore'),
    MetadataStore = require('../store/MetadataStore');

var LayoutComponent = React.createClass({

    mixins: [dragAndDropMixin],

    propTypes: {
        componentdata: React.PropTypes.object.isRequired,
        contextMetadata: React.PropTypes.object.isRequired
    },

    render: function () {
        var childLayoutComponents = this._createChildComponents(),
            classes = "nl-component nl-layout-component " + this.props.componentdata.componentType,
            childrenLength = childLayoutComponents === null ? 0 : childLayoutComponents.length,
            childClasses = "child-components children-" + childrenLength,
            iconClass = 'component-icon icon-' + this.props.componentdata.componentType,
            cmsHints = this.props.componentdata._cmsHints || {};

        // Get the component type metadata
        var componentMetadata = MetadataStore.getComponentByType(this.props.componentdata.componentType);

        // determine preview
        var preview = null;
        if (cmsHints.thumbnailUrl) {
            preview = (
                <img src={cmsHints.thumbnailUrl} />
            );
        } else {
            preview = (
                <span className={iconClass}></span>
            );
        }

        return (
            <div
                className={classes}
                draggable="true"
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}
                data-componentid={this.props.componentdata.id}>

                <div className="nl-icon-container">
                    {preview}{componentMetadata.name}
                </div>

                <LayoutComponentEditor
                    componentdata={this.props.componentdata}
                    contextMetadata={this.props.contextMetadata} />

                <div className={childClasses}>
                    {childLayoutComponents}
                </div>
            </div>
        );
    },

    /**
     * @func _createChildComponents
     * @return {array} Child layout fields of the current WorkspaceField.
     * @desc Create the child components for the current WorkspaceField.
     */
    _createChildComponents: function () {
        var children = ComponentStore.getChildren(this.props.componentdata.id),
            childComponents = [],
            i = 0;

        if (children.length === 0) {
            return null;
        }

        for (i; i < children.length; i +=1) {
            childComponents.push(
                <LayoutComponent
                    key={children[i].id}
                    componentdata={children[i]}
                    contextMetadata={this.props.contextMetadata} />
            );
        };

        return childComponents;
    }
});

module.exports = LayoutComponent;
