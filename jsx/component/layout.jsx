/**
 * @file A Layout is made up of one or more LayoutComponents.
 * @module Layout
 * @requires module:react
 * @requires module:node-uuid
 * @requires module:../mixin/componentUtils
 * @requires module:./layoutComponent
 */

'use strict';

var React = require('react'),
    uuid = require('node-uuid'),
    componentUtilsMixin = require('../mixin/componentUtils'),
    LayoutComponent = require('./layoutComponent');

var Layout = React.createClass({

    mixins: [componentUtilsMixin],

    propTypes: {
        metadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            layoutdata: JSON.parse(document.getElementById('Form_EditForm_EditableLayout').value)
        };
    },

    /**
     * @func _getComponentById
     * @param {String} id The id of the LayoutComponent you're looking for
     * @param {Object} parent The LayoutComponent to check against (if undefined, starts from root)
     */
    _getComponentById: function (id, parent) {
        var i = 0,
            component = null;

        if (parent === void 0) {
            parent = this.state.layoutdata;
        }

        if (id !== parent.id) {
            if (this._componentHasChildren(parent)) {
                for (i; i < parent.children.length; i += 1) {
                    component = this._getComponentById(id, parent.children[i]);

                    if (component !== null) {
                        break;
                    }
                }
            }
        } else {
            component = parent;
        }

        return component;
    },

    /**
     * @func _updateComponent
     * @param {String} id The id of the LayoutComponent you want to update.
     * @param {Object} binding The new value of the LayoutComponent.
     * @desc Update the Layout's state with new LayoutComponent data.
     */
    _updateComponent: function (id, binding) {
        var component = this._getComponentById(id);

        component.bindings = binding;

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
    },

    /**
     * @func _removeComponent
     * @param {String} id The ID of the LayoutComponent to remove.
     * @desc Revomes a LayoutComponent and all of it's children from the Layout.
     */
    _removeComponent: function (id, component, parent) {
        var i = 0;

        // If there's no parent, we're dealing with the root element, so use the state.
        if (parent === void 0) {
            parent = this.state.layoutdata;
            component = this.state.layoutdata;
        }

        if (component.id !== id) {
            // The id's don't match, so try the children, if there are any.
            if (this._componentHasChildren(component)) {
                for (i; i < component.children.length; i += 1) {
                    this._removeComponent(id, component.children[i], component);
                }
            }
        } else {
            // Remove the matching LayoutComponent from its parent.

            // If we're at the root level, set the state to an empty object.
            if (component === parent) {
                this.setState({ layoutData: {} });
            }

            parent.children = parent.children.filter(function (childComponent) {
                return childComponent !== component;
            });

            this.forceUpdate();

            document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
        }
    },

    /**
     * @func _moveComponent
     * @param {String} id The ID of the LayoutComponent that's getting moved.
     * @param {String} toId Parent we're moving the LayoutComponent to.
     * @desc Move a LayoutComponent to a new parent.
     */
    _moveComponent: function (id, toId) {
        var component = this._getComponentById(id),
            newParent = this._getComponentById(toId);

        // Remove the component from its current location
        this._removeComponent(component.id);

        // Add the component to its new location.
        newParent.children = newParent.children || [];
        newParent.children.push(component);

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);
    },

    /**
     * @func _addComponent
     * @param {String} parentId ID of the LayoutComponent we're adding the new LayoutComponent to.
     * @param {String} componentType Type of LayoutComponent we're adding.
     * @return {String} ID of the new LayoutComponent.
     * @desc Add a workspce field to the Workspace.
     */
    _addComponent: function (parentId, componentType) {
        var parentField = this._getComponentById(parentId),
            newId = uuid.v4();

        parentField.children = parentField.children || [];

        parentField.children.push({
            ClassName: componentType,
            bindings: {},
            id: newId
        });

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.layoutdata);

        return newId;
    },

    /**
     * @func _componentIsRoot
     * @param {String} id The id of the LayoutComponent we're checking.
     * @return {Boolean}
     * @desc Determine if a LayoutComponent is the root component.
     */
    _componentIsRoot: function (id) {
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
                    updateComponent={this._updateComponent}
                    removeComponent={this._removeComponent}
                    componentIsRoot={this._componentIsRoot}
                    addComponent={this._addComponent}
                    moveComponent={this._moveComponent} />
            </div>
        );
    }
});

module.exports = Layout;
