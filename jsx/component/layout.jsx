/**
 * @file A Layout is made up of one or more LayoutComponents.
 * @module Layout
 * @requires module:react
 * @requires module:node-uuid
 * @requires module:./layoutComponent
 */

'use strict';

var React = require('react'),
    uuid = require('node-uuid'),
    LayoutComponent = require('./layoutComponent');

var Layout = React.createClass({

    propTypes: {
        metadata: React.PropTypes.object.isRequired
    },

    /**
     * @func _allocateIds
     * @param {Object} layoutComponent The field you wish to assign an id to.
     * @return {Object} The updated LayoutComponent.
     * @desc Recursivly allocate id's to a LayoutComponent. LayoutComponents with an existing id are ignored.
     */
    _allocateIds: function (layoutComponent) {
        var i = 0;

        layoutComponent.id = layoutComponent.id || uuid.v4();

        if (typeof layoutComponent.children !== 'undefined' && layoutComponent.children.length > 0) {
            for (i; i < layoutComponent.children.length; i += 1) {
                layoutComponent.children[i] = this._allocateIds(layoutComponent.children[i]);
            }
        }

        return layoutComponent;
    },

    getInitialState: function () {
        return {
            layoutdata: JSON.parse(document.getElementById('Form_EditForm_EditableLayout').value)
        };
    },

    /**
     * @func _getLayoutComponentById
     * @param {String} id The id of the LayoutComponent you're looking for
     * @param {Object} parent The LayoutComponent to check against (if undefined, starts from root)
     */
    _getLayoutComponentById: function (id, parent) {
        var i = 0,
            layoutComponent = null;

        if (typeof parent === 'undefined') {
            parent = this.state.layoutdata;
        }

        if (id !== parent.id) {
            if (typeof parent.children !== 'undefined' && parent.children.length > 0) {
                for (i; i < parent.children.length; i += 1) {
                    layoutComponent = this._getLayoutComponentById(id, parent.children[i]);

                    if (layoutComponent !== null) {
                        break;
                    }
                }
            }
        } else {
            layoutComponent = parent;
        }

        return layoutComponent;
    },

    /**
     * @func _updateLayoutComponentData
     * @param {String} id The id of the LayoutComponent you want to update.
     * @param {Object} binding The new value of the LayoutComponent.
     * @desc Update the Layout's state with new LayoutComponent data.
     */
    _updateLayoutComponentData: function (id, binding) {
        var workspaceField = this._getLayoutComponentById(id);

        workspaceField.bindings = binding;

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
    },

    /**
     * @func _removeLayoutComponentFromLayout
     * @param {String} id The ID of the LayoutComponent to remove.
     * @desc Revomes a LayoutComponent and all of it's children from the Layout.
     */
    _removeLayoutComponentFromLayout: function (id, layoutComponent, parent) {
        var i = 0;

        // If there's no parent, we're dealing with the root element, so use the state.
        if (typeof parent === 'undefined') {
            parent = this.state.layoutdata;
            layoutComponent = this.state.layoutdata;
        }

        if (layoutComponent.id !== id) {
            // The id's don't match, so try the children.
            if (typeof layoutComponent.children !== 'undefined' && layoutComponent.children.length > 0) {
                for (i; i < layoutComponent.children.length; i += 1) {
                    this._removeLayoutComponentFromLayout(id, layoutComponent.children[i], layoutComponent);
                }
            }
        } else {
            // Remove the matching LayoutComponent from its parent.

            // If we're at the root level, set the state to an empty object.
            if (layoutComponent === parent) {
                this.setState({ layoutData: {} });
            }

            parent.children = parent.children.filter(function (childLayoutComponent) {
                return childLayoutComponent !== layoutComponent;
            });

            this.forceUpdate();

            document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
        }
    },

    /**
     * @func _moveLayoutComponent
     * @param {String} id The ID of the LayoutComponent that's getting moved.
     * @param {String} toId Parent we're moving the LayoutComponent to.
     * @desc Move a LayoutComponent to a new parent.
     */
    _moveLayoutComponent: function (id, toId) {
        var layoutComponent = this._getLayoutComponentById(id),
            newParent = this._getLayoutComponentById(toId);

        // Remove the LayoutComponent from its current location
        this._removeLayoutComponentFromLayout(layoutComponent.id);

        // Add the LayoutComponent to its new location.
        newParent.children = newParent.children || [];
        newParent.children.push(layoutComponent);

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
    },

    /**
     * @func _addLayoutComponent
     * @param {String} parentId ID of the LayoutComponent we're adding the new LayoutComponent to.
     * @param {String} layoutComponentType Type of LayoutComponent we're adding.
     * @return {String} ID of the new LayoutComponent.
     * @desc Add a workspce field to the Workspace.
     */
    _addLayoutComponent: function (parentId, layoutComponentType) {
        var parentField = this._getLayoutComponentById(parentId),
            newId = uuid.v4();

        parentField.children = parentField.children || [];

        parentField.children.push({
            ClassName: layoutComponentType,
            bindings: {},
            id: newId
        });

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);

        return newId;
    },

    /**
     * @func _layoutComponentIsRoot
     * @param {String} id The id of the LayoutComponent we're checking.
     * @return {Boolean}
     * @desc Determine if a LayoutComponent is the root component.
     */
    _layoutComponentIsRoot: function (id) {
        var isRoot = false;

        if (id === this.state.layoutdata.id) {
            isRoot = true;
        }

        return isRoot;
    },

    render: function () {
        // if the state layoutData property is an empty object, there are no LayoutComponents to render.
        if (Object.getOwnPropertyNames(this.state.layoutdata).length === 0) {
            return (
                <p>No layout components to render.</p>
            );
        }

        return (
            <div className="nl-layout">
                <LayoutComponent
                    layoutdata={this.state.layoutdata}
                    metadata={this.props.metadata}
                    updateLayoutComponentData={this._updateLayoutComponentData}
                    removeLayoutComponentFromLayout={this._removeLayoutComponentFromLayout}
                    layoutComponentIsRoot={this._layoutComponentIsRoot}
                    addLayoutComponent={this._addLayoutComponent}
                    moveLayoutComponent={this._moveLayoutComponent} />
            </div>
        );
    }
});

module.exports = Layout;
