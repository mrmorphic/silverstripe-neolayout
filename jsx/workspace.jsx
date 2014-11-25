/**
 * @file Wrapper component for the various layout types.
 * @module Workspace
 */

'use strict';

var React = require('react'),
    WorkspaceField = require('./workspaceField');

var Workspace = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            fieldData: this.props.data
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

    render: function () {
        return (
            <WorkspaceField
                data={this.props.data}
                metadata={this.props.metadata}
                updateFieldData={this.updateFieldData} />
        );
    }
});

module.exports = Workspace;
