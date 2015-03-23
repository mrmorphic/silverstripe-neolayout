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
        updateComponent: React.PropTypes.func.isRequired,
        removeComponent: React.PropTypes.func.isRequired,
        getComponentSchema: React.PropTypes.func.isRequired,
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

    _handleRemoveButtonClick: function () {
        this.props.removeComponent(this.props.layoutdata.id);
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
            editButton = <a className="icon-pencil" href="javascript:void(0)" onClick={this._toggleModalEditor}></a>;
        }

        if (this.props.canRemove()) {
            removeButton = <a className="icon-bin" href="javascript:void(0)" onClick={this._handleRemoveButtonClick}></a>;
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
                        updateComponent={this.props.updateComponent}
                        getComponentSchema={this.props.getComponentSchema} />
                </div>
                <div className={this._getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    }
});

module.exports = LayoutComponentEditor;
