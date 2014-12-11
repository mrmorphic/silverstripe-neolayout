/**
 * @file Enables editing of a WorkspaceField.
 * @module FieldEditor
 */

'use strict';

var React = require('react'),
    FieldEditorForm = require('./fieldEditorForm');

var FieldEditor = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        updateFieldData: React.PropTypes.func.isRequired,
        removeFieldFromWorkspace: React.PropTypes.func.isRequired,
        canEdit: React.PropTypes.func.isRequired,
        canRemove: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            editing: false
        };
    },

    /**
     * @func _getCssClasses
     * @param {String} requiredClasses CSS classes that are required for the element.
     * @return {String} Includes the required class and the 'hide' class if the condition is met.
     * @desc If the FieldEditor is not currently in use, the hide class will be added to the element.
     */
    _getCssClasses: function (requiredClasses) {
        return this.state.editing === true ? requiredClasses : requiredClasses + ' hide';
    },

    /**
     * @func _toggleModalEditor
     * @desc Toggle the 'editing' state of the editor.
     */
    _toggleModalEditor: function () {
        this.setState({ editing: !this.state.editing });
    },

    _removeFieldFromWorkspace: function () {
        this.props.removeFieldFromWorkspace(this.props.data.id);
    },

    /**
     * @func _getEditorButtons
     * @return {Object}
     * @desc Generate the buttons available in the editor.
     */
    _getEditorButtons: function () {
        var editButton = null,
            removeButton = null;

        if (this.props.canEdit()) {
            editButton = <button type="button" onClick={this._toggleModalEditor}>Edit</button>;
        }

        if (this.props.canRemove()) {
            removeButton = <button type="button" onClick={this._removeFieldFromWorkspace}>Remove</button>;
        }

        return (
            <div className="actions">
                {editButton}
                {removeButton}
            </div>
        );
    },

    render: function () {
        var editorButtons = this._getEditorButtons();

        return (
            <div className="nl-field-editor">
                {editorButtons}
                <div className={this._getCssClasses('nl-modal-editor')}>
                    <h3>{this.props.data.ClassName}</h3>
                    <FieldEditorForm
                        data={this.props.data}
                        metadata={this.props.metadata}
                        toggleModalEditor={this._toggleModalEditor}
                        updateFieldData={this.props.updateFieldData} />
                </div>
                <div className={this._getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    }
});

module.exports = FieldEditor;
