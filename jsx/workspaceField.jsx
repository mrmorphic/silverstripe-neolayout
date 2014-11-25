'use strict';

var React = require('react'),
    FieldEditor = require('./fieldEditor');

var WorkspaceField = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
    },
    getInitialState: function () {
        return {
            bindings: this.props.data.bindings
        };
    },
    updateFieldBindings: function (value) {
        console.log('updated field with:');
        console.log(value);
        //this.setState({ bindings: value });
    },
    createChildFields: function () {
        var childFields = null,
            i = 0;

        if (typeof this.props.data.children !== 'undefined') {
            childFields = [];

            for (i; i < this.props.data.children; i +=1) {
                childFields.push(
                    <WorkspaceField data={this.props.data.children[i]} metadata={this.props.metadata} key={i} />
                );
            };
        }

        return childFields;
    },
    render: function () {
        var childFields = this.createChildFields();

        return (
            <div className="nl-component nl-workspace-field">
                <h3>{this.props.data.ClassName}</h3>
                <FieldEditor data={this.props.data} metadata={this.props.metadata} updateFieldBindings={this.updateFieldBindings} />
                {childFields}
            </div>
        );
    }
});

module.exports = WorkspaceField;
