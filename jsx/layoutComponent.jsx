/**
 * @file The core component used to create layouts.
 * @module LayoutComponent
 */

'use strict';

var $ = require('jquery'),
    React = require('react'),
    LayoutComponentEditor = require('./layoutComponentEditor/editor');

var LayoutComponent = React.createClass({

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
     * @func _allowDrop
     * @desc By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
     */
    _allowDrop: function (event) {
        event.preventDefault();
    },

    /**
     * @func _nodeBelongsToLayoutComponent
     * @param {Object} node A DOM node
     * @return {Boolean}
     * @desc Check if a DOM node is part of a WorkspaceField.
     */
    _nodeBelongsToLayoutComponent: function (node) {
        var $node = $(node);

        return $node.data('uuid') === this.props.layoutdata.id ||
            $node.closest('.nl-layout-component').data('uuid') === this.props.layoutdata.id;
    },

    /**
     * @func _handleDragStart
     * @desc Handle the drag event on a LayoutComponent
     */
    _handleDragStart: function (event) {
        var data = {
            componentType: "LayoutComponent",
            componentData: this.props.layoutdata
        };

        if (this._nodeBelongsToLayoutComponent(event.target) || this.getDOMNode() === event.target) {
            event.dataTransfer.setData('text', JSON.stringify(data));
        }
    },

    /**
     * @func _hasAncestor
     * @param {String} id
     * @desc Check if the current LayoutComponent has an ancestor matching an ID.
     * @todo Do this via React rather than DOM.
     */
    _hasAncestor: function (id) {
        return ($.contains($('[data-uuid="' + id + '"]')[0], this.getDOMNode()));
    },

    /**
     * @func _handleDrop
     * @desc Handle the drop event of a LayoutComponent.
     */
    _handleDrop: function (event) {
        var data;

        if (this._nodeBelongsToLayoutComponent(event.target) || this.getDOMNode() === event.target) {
            data = JSON.parse(event.dataTransfer.getData('text'));

            // Check the type of component being dropped.
            if (data.componentType === "PaletteComponent") {
                this.props.addLayoutComponent(this.props.layoutdata.id, data.componentData.componentType);
            } else if (data.componentType === "LayoutComponent") {
                // Don't allow dropping parents onto children.
                if (!this._hasAncestor(data.componentData.id)) {
                    this.props.moveLayoutComponent(data.componentData.id, this.props.layoutdata.id);
                }
            }
        }
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
                onDragOver={this._allowDrop}>

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
