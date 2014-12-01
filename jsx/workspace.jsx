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

    getInitialState: function () {
        return {
            // We're cloning this.props.data here because we can't tell if this.props.data
            // needs to remain consistant further up the chain.
            fieldData: this.allocateIds(JSON.parse(JSON.stringify(this.props.data)))
        };
    },

    /**
     * @func updateFieldData
     * @param {String} workspaceFieldId The id of the WorkspaceField you want to update.
     * @param {Object} binding The new value of the WorkspaceField.
     * @param {Object} workspaceField The workspace field you want to start at. If undefined will recursivly search from the root element.
     * @desc Update the Workspace's state. Will recurse down children from the `workspaceField` param.
     */
    updateFieldData: function (workspaceFieldId, binding, workspaceField) {
        var i = 0;

        if (typeof workspaceField === 'undefined') {
            workspaceField = this.state.fieldData;
        }

        if (workspaceField.id !== workspaceFieldId) {
            // The id's don't match, so try the children.
            if (typeof workspaceField.children !== 'undefined' && workspaceField.children.length > 0) {
                for (i; i < workspaceField.children.length; i += 1) {
                    this.updateFieldData(workspaceFieldId, binding, workspaceField.children[i]);
                }
            }
        } else {
            // Update the WorkspaceField's binding value.
            workspaceField.bindings = binding;

            // We've modified the state directly, rather than via setState(),
            // so we have to call forceUpdate() to re-render.
            this.forceUpdate();

            // Save the new state to the CMS input field so we can save to the DB.
            document.getElementById('Form_EditForm_EditableLayout').value = JSON.stringify(this.state.fieldData);
        }
    },

    /**
     * @func removeFieldFromWorkspace
     * @desc Revomes a WorkspaceField and all of it's children from the Workspace.
     */
    removeFieldFromWorkspace: function (workspaceFieldId, workspaceField, parent) {
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
                    this.removeFieldFromWorkspace(workspaceFieldId, workspaceField.children[i], workspaceField);
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
     * @func fieldIsRoot
     * @param {String} id The id of the field we're checking.
     * @return {Boolean}
     * @desc Determine if a WorkspaceField is the root component.
     */
    fieldIsRoot: function (id) {
        var isRoot = false;

        if (id === this.state.fieldData.id) {
            isRoot = true;
        }

        return isRoot;
    },

    /**
     * @func allocateIds
     * @param {Object} workspaceField The field you wish to assign an id to.
     * @return {Object} The updated workspaceField.
     * @desc Recursivly allocate id's to a WorkspaceField. WorkspaceField's with an existing id are ignored.
     */
    allocateIds: function (workspaceField) {
        var i = 0;

        workspaceField.id = workspaceField.id || uuid.v4();

        if (typeof workspaceField.children !== 'undefined' && workspaceField.children.length > 0) {
            for (i; i < workspaceField.children.length; i += 1) {
                workspaceField.children[i] = this.allocateIds(workspaceField.children[i]);
            }
        }

        return workspaceField;
    },

    /**
     * @func getWorkspaceFields
     * @return {Object}
     * @desc Get the root workspace field for rendering.
     */
    getWorkspaceFields: function () {
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
                updateFieldData={this.updateFieldData}
                removeFieldFromWorkspace={this.removeFieldFromWorkspace}
                fieldIsRoot={this.fieldIsRoot} />
        );
    },

    render: function () {
        return this.getWorkspaceFields();
    }
});

module.exports = Workspace;
