/**
 * @file The core component used to create layouts.
 * @module LayoutComponent
 * @requires module:react
 * @requires module:./layoutComponentEditor/editor
 * @requires mixin:../mixin/dragAndDrop
 * @requires mixin:../mixin/util
 */

'use strict';

var React = require('react'),
    LayoutComponentEditor = require('./layoutComponentEditor/editor'),
    dragAndDropMixin = require('../mixin/dragAndDrop'),
    utilMixin = require('../mixin/util');

var LayoutComponent = React.createClass({

    mixins: [dragAndDropMixin, utilMixin],

    propTypes: {
        layoutdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        updateLayoutComponentData: React.PropTypes.func.isRequired,
        removeLayoutComponentFromLayout: React.PropTypes.func.isRequired,
        layoutComponentIsRoot: React.PropTypes.func.isRequired,
        addLayoutComponent: React.PropTypes.func.isRequired,
        moveLayoutComponent: React.PropTypes.func.isRequired
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
        return this.props.layoutComponentIsRoot(this.props.layoutdata.id) === false;
    },

    /**
     * @func _createChildLayoutComponents
     * @return {Array} Child layout fields of the current WorkspaceField.
     * @desc Create the child components for the current WorkspaceField.
     */
    _createChildLayoutComponents: function () {
        var childLayoutComponents = null,
            i = 0;

        if (typeof this.props.layoutdata.children !== 'undefined') {
            childLayoutComponents = [];

            for (i; i < this.props.layoutdata.children.length; i +=1) {
                childLayoutComponents.push(
                    <LayoutComponent
                        key={i}
                        layoutdata={this.props.layoutdata.children[i]}
                        metadata={this.props.metadata}
                        updateLayoutComponentData={this.props.updateLayoutComponentData}
                        removeLayoutComponentFromLayout={this.props.removeLayoutComponentFromLayout}
                        layoutComponentIsRoot={this.props.layoutComponentIsRoot}
                        addLayoutComponent={this.props.addLayoutComponent}
                        moveLayoutComponent={this.props.moveLayoutComponent} />
                );
            };
        }

        return childLayoutComponents;
    },

    /**
     * @func _getLayoutComponentSchema
     * @return {Array} The schemas relating to a LayoutComponent.
     * @desc Get the schema for the LayoutComponent.
     */
    _getLayoutComponentSchema: function () {
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
        var childLayoutComponents = this._createChildLayoutComponents();

        return (
            <div
                className="nl-component nl-layout-component"
                data-uuid={this.props.layoutdata.id}
                draggable="true"
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}>

                <h3>{this.props.layoutdata.ClassName}</h3>

                <LayoutComponentEditor
                    layoutdata={this.props.layoutdata}
                    metadata={this.props.metadata}
                    updateLayoutComponentData={this.props.updateLayoutComponentData}
                    removeLayoutComponentFromLayout={this.props.removeLayoutComponentFromLayout}
                    getLayoutComponentSchema={this._getLayoutComponentSchema}
                    canEdit={this._canEdit}
                    canRemove={this._canRemove} />

                {childLayoutComponents}
            </div>
        );
    }
});

module.exports = LayoutComponent;
