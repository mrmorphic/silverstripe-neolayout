'use strict';

var React = require('react'),
    $ = require('jquery'),
    FieldEditorForm = require('./fieldEditorForm');

var FieldEditor = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return { editing: false };
    },
    getCssClasses: function (requiredClasses) {
        return this.state.editing === true ? requiredClasses : requiredClasses + ' hide';
    },
    toggleModalEditor: function () {
        this.setState({ editing: !this.state.editing });
    },
    render: function () {
        if (typeof this.props.data.bindings !== 'undefined') {
            $.each(this.props.data.bindings, function () {
                // @todo What do we do with bindings?
            });
        }

        return (
            <div className="nl-field-editor">
                <button type="button" onClick={this.toggleModalEditor}>Edit</button>
                <button type="button">Remove</button>
                <div className={this.getCssClasses('nl-modal-editor')}>
                    <h3>{this.props.data.ClassName}</h3>
                    <FieldEditorForm data={this.props.data} metadata={this.props.metadata} toggleModalEditor={this.toggleModalEditor} />
                </div>
                <div className={this.getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    }
});

module.exports = FieldEditor;
