/**
 * @file Wrapper component for the various layout types.
 * @module Workspace
 */

'use strict';

var React = require('react'),
    uuid = require('node-uuid'),
    WorkspaceField = require('./workspaceField');

var Workspace = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },

    /**
     * @func _allocateIds
     * @param {Object} workspaceField The field you wish to assign an id to.
     * @return {Object} The updated workspaceField.
     * @desc Recursivly allocate id's to a WorkspaceField. WorkspaceField's with an existing id are ignored.
     */
    _allocateIds: function (workspaceField) {
        var i = 0;

        workspaceField.id = workspaceField.id || uuid.v4();

        if (typeof workspaceField.children !== 'undefined' && workspaceField.children.length > 0) {
            for (i; i < workspaceField.children.length; i += 1) {
                workspaceField.children[i] = this._allocateIds(workspaceField.children[i]);
            }
        }

        return workspaceField;
    },

    getInitialState: function () {
        return {
            // We're cloning this.props.data here because we can't tell if this.props.data
            // needs to remain consistant further up the chain.
            fieldData: this._allocateIds(JSON.parse(JSON.stringify(this.props.data)))
        };
    },

    /**
     * @func _getFieldById
     * @param {String} id The id of the WorkspaceField you're looking for
     * @param {Object} parent The field to check against (if undefined, starts from root)
     */
    _getFieldById: function (id, parent) {
        var i = 0,
            field = null;

        if (typeof parent === 'undefined') {
            parent = this.state.fieldData;
        }

        if (id !== parent.id) {
            if (typeof parent.children !== 'undefined' && parent.children.length > 0) {
                for (i; i < parent.children.length; i += 1) {
                    field = this._getFieldById(id, parent.children[i]);

                    if (field !== null) {
                        break;
                    }
                }
            }
        } else {
            field = parent;
        }

        return field;
    },

    /**
     * @func _updateFieldData
     * @param {String} id The id of the WorkspaceField you want to update.
     * @param {Object} binding The new value of the WorkspaceField.
     * @desc Update the Workspace's state. Will recurse down children from the `workspaceField` param.
     */
    _updateFieldData: function (id, binding) {
        var workspaceField = this._getFieldById(id);

        workspaceField.bindings = binding;

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.fieldData);
    },

    /**
     * @func _removeFieldFromWorkspace
     * @desc Revomes a WorkspaceField and all of it's children from the Workspace.
     */
    _removeFieldFromWorkspace: function (workspaceFieldId, workspaceField, parent) {
        var i = 0;

        // If there's no parent, we're dealing with the root element, so use the state.
        if (typeof parent === 'undefined') {
            parent = this.state.fieldData;
            workspaceField = this.state.fieldData;
        }

        if (workspaceField.id !== workspaceFieldId) {
            // The id's don't match, so try the children.
            if (typeof workspaceField.children !== 'undefined' && workspaceField.children.length > 0) {
                for (i; i < workspaceField.children.length; i += 1) {
                    this._removeFieldFromWorkspace(workspaceFieldId, workspaceField.children[i], workspaceField);
                }
            }
        } else {
            // Remove the matching field from the parent.

            // If we're at the root level, set the state to an empty object.
            if (workspaceField === parent) {
                this.setState({ fieldData: {} });
            }

            parent.children = parent.children.filter(function (childField) {
                return childField !== workspaceField;
            });

            // We've modified the state directly, rather than via setState(),
            // so we have to call forceUpdate() to re-render.
            this.forceUpdate();

            // Save the new state to the CMS input field so we can save to the DB.
            document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.fieldData);
        }
    },

    /**
     * @func _moveWorkspaceField
     * @param {String} fieldId Field that's getting moved
     * @param {String} toId Parent we're moving the field to
     * @desc Move a workspace field to a new parent.
     */
    _moveWorkspaceField: function (fieldId, toId) {
        var field = this._getFieldById(fieldId),
            newParent = this._getFieldById(toId);

        // Remove the field from its current location
        this._removeFieldFromWorkspace(field.id);

        // Add the field to its new location.
        newParent.children = newParent.children || [];
        newParent.children.push(field);

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.fieldData);
    },

    /**
     * @func _addWorkspaceField
     * @param {String} parentId ID of the WorkspaceField we're adding the new component to.
     * @param {String} fieldType Type of field we're adding.
     * @return {String} ID of the new WorkspaceField.
     * @desc Add a workspce field to the Workspace.
     */
    _addWorkspaceField: function (parentId, fieldType) {
        var parentField = this._getFieldById(parentId),
            newId = uuid.v4();

        parentField.children = parentField.children || [];

        parentField.children.push({
            ClassName: fieldType,
            bindings: {},
            id: newId
        });

        this.forceUpdate();

        document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.fieldData);

        return newId;
    },

    /**
     * @func _fieldIsRoot
     * @param {String} id The id of the field we're checking.
     * @return {Boolean}
     * @desc Determine if a WorkspaceField is the root component.
     */
    _fieldIsRoot: function (id) {
        var isRoot = false;

        if (id === this.state.fieldData.id) {
            isRoot = true;
        }

        return isRoot;
    },

    render: function () {
        // if the state's fieldData property is an empty object, there are no fields to render.
        if (Object.getOwnPropertyNames(this.state.fieldData).length === 0) {
            return (
                <p>No fields to render.</p>
            );
        }

        return (
            <WorkspaceField
                data={this.state.fieldData}
                metadata={this.props.metadata}
                updateFieldData={this._updateFieldData}
                removeFieldFromWorkspace={this._removeFieldFromWorkspace}
                fieldIsRoot={this._fieldIsRoot}
                addWorkspaceField={this._addWorkspaceField}
                moveWorkspaceField={this._moveWorkspaceField} />
        );
    }
});

module.exports = Workspace;
