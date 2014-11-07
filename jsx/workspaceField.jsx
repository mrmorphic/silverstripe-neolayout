'use strict';

var React = require('react'),
    $ = require('jquery'),
    Toolbar = require('./toolbar');

var WorkspaceField = React.createClass({
    createChildFields: function () {
        var self = this,
            childFields = null;

        if (typeof this.props.data.children !== 'undefined') {
            childFields = [];

            $.each(this.props.data.children, function () {
                childFields.push(<WorkspaceField data={this} metadata={self.props.metadata} />);
            });
        }

        return childFields;
    },
    render: function () {
        var childFields = this.createChildFields();

        return (
            <div className="nl-component nl-workspace-field">
                <h3>{this.props.data.ClassName}</h3>
                <Toolbar data={this.props.data} metadata={this.props.metadata} />
                {childFields}
            </div>
        );
    }
});

module.exports = WorkspaceField;
