'use strict';

var React = require('react'),
    Toolbar = require('./toolbar'),
    WorkspaceField = require('./workspaceField');

var Workspace = React.createClass({
    createWorkspaceFields: function () {
        var self = this;

        return this.props.data.children.map(function (fieldData, i) {
            return (
                <WorkspaceField data={fieldData} metadata={self.props.metadata} key={i} />
            );
        });
    },
    render: function () {
        var workspaceFields = this.createWorkspaceFields();

        return (
            <div className="nl-workspace">
                <Toolbar data={this.props.data} metadata={this.props.metadata} />
                {workspaceFields}
            </div>
        );
    }
});

module.exports = Workspace;
