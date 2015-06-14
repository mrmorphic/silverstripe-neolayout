/**
 * @file Enables editing of a LayoutComponent.
 * @module LayoutComponentEditor
 * @requires module:react
 * @requires module:./editorForm
 * @requires module:../../store/ComponentStore
 * @requires module:../../action/ComponentActions
 */

'use strict';

var React = require('react'),
    EditorForm = require('./editorForm'),
    ComponentStore = require('../../store/ComponentStore'),
    ComponentActions = require('../../action/ComponentActions');

var LayoutComponentEditor = React.createClass({

    propTypes: {
        componentdata: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            editing: false
        };
    },

    render: function () {
        var editorButtons = this._getEditorButtons();

        return (
            <div className="nl-field-editor">
                {editorButtons}
                <div className={this._getCssClasses('nl-modal-editor')}>
                    <h3>{this.props.componentdata.ClassName}</h3>
                    <EditorForm
                        componentdata={this.props.componentdata}
                        metadata={this.props.metadata}
                        toggleModalEditor={this._toggleModalEditor} />
                </div>
                <div className={this._getCssClasses('nl-modal-mask')}></div>
            </div>
        );
    },

    /**
     * @func _getCssClasses
     * @param {string} requiredClasses - CSS classes that are required for the element.
     * @return {string} - Includes the required class and the 'hide' class if the condition is met.
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
        ComponentActions.destroy(this.props.componentdata.id);
    },

    /**
     * @func _getEditorButtons
     * @return {object}
     * @desc Generate the buttons available in the editor.
     */
    _getEditorButtons: function () {
        var editButton = null,
            removeButton = null;

        if (ComponentStore.canEdit(this.props.componentdata.id)) {
            editButton = <a className="icon-pencil" href="javascript:void(0)" onClick={this._toggleModalEditor}></a>;
        }

        if (ComponentStore.canRemove(this.props.componentdata.id)) {
            removeButton = <a className="icon-bin" href="javascript:void(0)" onClick={this._handleRemoveButtonClick}></a>;
        }

        return (
            <div className="actions">
                {editButton}
                {removeButton}
            </div>
        );
    }
});

module.exports = LayoutComponentEditor;
