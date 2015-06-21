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
    ComponentStore = require('../store/ComponentStore');

var LayoutComponent = React.createClass({

    mixins: [dragAndDropMixin],

    propTypes: {
        componentdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },

    render: function () {
        var childLayoutComponents = this._createChildComponents(),
            classes = "nl-component nl-layout-component " + this.props.componentdata.ClassName,
            childrenLength = childLayoutComponents === null ? 0 : childLayoutComponents.length,
            childClasses = "child-components children-" + childrenLength,
            iconClass = 'component-icon icon-' + this.props.componentdata.ClassName;

        return (
            <div
                className={classes}
                draggable="true"
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}
                data-componentid={this.props.componentdata.id}>

                <span className={iconClass}></span>

                <LayoutComponentEditor
                    componentdata={this.props.componentdata}
                    metadata={this.props.metadata} />

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
                    metadata={this.props.metadata} />
            );
        };

        return childComponents;
    }
});

module.exports = LayoutComponent;
