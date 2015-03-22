/**
 * @file The core component used to create layouts.
 * @module LayoutComponent
 * @requires module:react
 * @requires module:./layoutComponentEditor/editor
 * @requires mixin:../mixin/dragAndDrop
 * @requires mixin:../mixin/componentUtils
 */

'use strict';

var React = require('react'),
    LayoutComponentEditor = require('./layoutComponentEditor/editor'),
    dragAndDropMixin = require('../mixin/dragAndDrop'),
    componentUtilsMixin = require('../mixin/componentUtils');

var LayoutComponent = React.createClass({

    mixins: [dragAndDropMixin, componentUtilsMixin],

    propTypes: {
        layoutdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        updateComponent: React.PropTypes.func.isRequired,
        removeComponent: React.PropTypes.func.isRequired,
        componentIsRoot: React.PropTypes.func.isRequired,
        addComponent: React.PropTypes.func.isRequired,
        moveComponent: React.PropTypes.func.isRequired
    },

    /**
     * @func _canEdit
     * @return {Boolean}
     * @desc Returns true if the user is able to edit the field.
     */
    _canEdit: function () {
        return true;
    },

    /**
     * @func _canRemove
     * @return {Boolean}
     * @desc Returns true if the user is able to remove the LayoutComponent from the Layout.
     */
    _canRemove: function () {
        return this.props.componentIsRoot(this.props.layoutdata.id) === false;
    },

    /**
     * @func _createChildComponents
     * @return {Array} Child layout fields of the current WorkspaceField.
     * @desc Create the child components for the current WorkspaceField.
     */
    _createChildComponents: function () {
        var childComponents = null,
            i = 0;

        if (this.props.layoutdata.children !== void 0) {
            childComponents = [];

            for (i; i < this.props.layoutdata.children.length; i +=1) {
                childComponents.push(
                    <LayoutComponent
                        key={i}
                        layoutdata={this.props.layoutdata.children[i]}
                        metadata={this.props.metadata}
                        updateComponent={this.props.updateComponent}
                        removeComponent={this.props.removeComponent}
                        componentIsRoot={this.props.componentIsRoot}
                        addComponent={this.props.addComponent}
                        moveComponent={this.props.moveComponent} />
                );
            };
        }

        return childComponents;
    },

    /**
     * @func _getComponentSchema
     * @return {Array} The schemas relating to a LayoutComponent.
     * @desc Get the schema for the LayoutComponent.
     */
    _getComponentSchema: function () {
        var schema = null,
            i = 0;

        for (i; i < this.props.metadata.components.length; i += 1) {
            if (this.props.metadata.components[i].componentType === this.props.layoutdata.ClassName) {
                schema = this.props.metadata.components[i];
                break;
            }
        }

        return schema;
    },

    render: function () {
        var childLayoutComponents = this._createChildComponents(),
            classes = "nl-component nl-layout-component " + this.props.layoutdata.ClassName,
            childrenLength = childLayoutComponents === null ? 0 : childLayoutComponents.length,
            childClasses = "child-components children-" + childrenLength;

        return (
            <div
                className={classes}
                data-uuid={this.props.layoutdata.id}
                draggable="true"
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}>

                <h3>{this.props.layoutdata.ClassName}</h3>

                <LayoutComponentEditor
                    layoutdata={this.props.layoutdata}
                    metadata={this.props.metadata}
                    updateComponent={this.props.updateComponent}
                    removeComponent={this.props.removeComponent}
                    getComponentSchema={this._getComponentSchema}
                    canEdit={this._canEdit}
                    canRemove={this._canRemove} />

                <div className={childClasses}>
                    {childLayoutComponents}
                </div>
            </div>
        );
    }
});

module.exports = LayoutComponent;
