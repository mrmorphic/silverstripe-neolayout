'use strict';

var React = require('react'),
    FieldEditor = require('./fieldEditor'),
    WorkspaceField = require('./workspaceField');

var Workspace = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },
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
                <FieldEditor data={this.props.data} metadata={this.props.metadata} />
                {workspaceFields}
            </div>
        );
    }
});

module.exports = Workspace;
