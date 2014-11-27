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
     * @param {Object} value The new value of the layout field.
     * @desc Update the Workspace's state.
     */
    updateFieldData: function (value) {
        console.log('field data updated');
        console.log(value);
    },

    /**
     * @func removeFieldFromWorkspace
     * @desc Revomes a WorkspaceField and all of it's children from the Workspace.
     */
    removeFieldFromWorkspace: function (workspaceFieldId) {
        console.log(workspaceFieldId);
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

    render: function () {
        return (
            <WorkspaceField
                data={this.state.fieldData}
                metadata={this.props.metadata}
                updateFieldData={this.updateFieldData}
                removeFieldFromWorkspace={this.removeFieldFromWorkspace} />
        );
    }
});

module.exports = Workspace;
