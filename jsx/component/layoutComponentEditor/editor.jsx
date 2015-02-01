/**
 * @file Enables editing of a LayoutComponent.
 * @module LayoutComponentEditor
 * @requires module:react
 * @requires module:./editorForm
 */

'use strict';

var React = require('react'),
    EditorForm = require('./editorForm');

var LayoutComponentEditor = React.createClass({

    propTypes: {
        layoutdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        updateLayoutComponentData: React.PropTypes.func.isRequired,
        removeLayoutComponentFromLayout: React.PropTypes.func.isRequired,
        getLayoutComponentSchema: React.PropTypes.func.isRequired,
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
     * @desc If the LayoutComponentEditor is not currently in use, the hide class will be added to the element.
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

    _removeLayoutComponentFromLayout: function () {
        this.props.removeLayoutComponentFromLayout(this.props.layoutdata.id);
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
            removeButton = <button type="button" onClick={this._removeLayoutComponentFromLayout}>Remove</button>;
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
                    <h3>{this.props.layoutdata.ClassName}</h3>
                    <EditorForm
                        layoutdata={this.props.layoutdata}
                        metadata={this.props.metadata}
                        toggleModalEditor={this._toggleModalEditor}
                        updateLayoutComponentData={this.props.updateLayoutComponentData}
                        getLayoutComponentSchema={this.props.getLayoutComponentSchema} />
                </div>
                <div className={this._getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    }
});

module.exports = LayoutComponentEditor;
