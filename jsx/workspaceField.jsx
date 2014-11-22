'use strict';

var React = require('react'),
    $ = require('jquery'),
    FieldEditor = require('./fieldEditor');

var WorkspaceField = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },
    createChildFields: function () {
        var self = this,
            childFields = null;

        if (typeof this.props.data.children !== 'undefined') {
            childFields = [];

            $.each(this.props.data.children, function (i, fieldData) {
                childFields.push(
                    <WorkspaceField data={fieldData} metadata={self.props.metadata} key={i} />
                );
            });
        }

        return childFields;
    },
    render: function () {
        var childFields = this.createChildFields();

        return (
            <div className="nl-component nl-workspace-field">
                <h3>{this.props.data.ClassName}</h3>
                <FieldEditor data={this.props.data} metadata={this.props.metadata} />
                {childFields}
            </div>
        );
    }
});

module.exports = WorkspaceField;
