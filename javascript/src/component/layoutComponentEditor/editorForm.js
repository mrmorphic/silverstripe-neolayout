/**
 * @file A sub-component of FieldEditor, responsible for saving and canceling changes.
 * @module FieldEditorForm
 * @requires module:react
 * @requires module:./editorFormRow
 * @requires module:../../action/ComponentActions
 */

'use strict';

var React = require('react'),
    EditorTab = require('./editorTab'),
    EditorComponentProperties = require('./editorComponentProperties'),
    EditorLayoutProperties = require('./editorLayoutProperties'),
    ComponentActions = require('../../action/ComponentActions'),
    MetadataStore = require('../../store/MetadataStore');

var EditorForm = React.createClass({

    propTypes: {
        componentdata: React.PropTypes.object.isRequired,
        contextMetadata: React.PropTypes.object.isRequired,
        toggleModalEditor: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            selectedTab: 0
        }
    },

    selectTab: function(tabIndex) {
        this.setState({
            selectedTab: tabIndex
        });
    },

    render: function () {
        var editorTabs = [],
            editorTabsContent = [];

        // @todo refactor this hacky mess

        var boundClick0 = this.selectTab.bind(this, 0);
        var boundClick1 = this.selectTab.bind(this, 1);
        var selected0 = this.state.selectedTab==0;
        var selected1 = this.state.selectedTab==1;

        // Add a tab for the component settings.
        editorTabs.push(
            <EditorTab title="Component settings" onClick={boundClick0} selected={selected0} key="0" />
        );
        editorTabsContent.push(
            <EditorComponentProperties ref="componentProperties"
                                        componentdata={this.props.componentdata}
                                        contextMetadata={this.props.contextMetadata}
                                        visible={selected0}
                                        key="0" />
        );

        // Add a tab for the layout settings.
        editorTabs.push(
            <EditorTab title="Layout settings" onClick={boundClick1} selected={selected1} key="1" />
        );
        editorTabsContent.push(
            <EditorLayoutProperties ref="layoutProperties"
                                    componentdata={this.props.componentdata}
                                    visible={selected1}
                                    key="1" />
        );

        return (
            <div className="field-editor-form">
                <ul className="field-editor-tabs">
                    {editorTabs}
                </ul>
                <div className="field-editor-tab-contents">
                    {editorTabsContent}
                </div>
                <div className="field-editor-actions">
                    <button className="field-editor-action save" onClick={this._handleSaveButtonClick}>Save</button>
                    <button className="field-editor-action cancel" onClick={this._handleCancelButtonClick}>Cancel</button>
                </div>
            </div>
        );
    },


    // /**
    //  * @func _getRows
    //  * @return {Array}
    //  * @desc Gets the EditorFormRows belonging to the current EditorForm.
    //  */
    // _getRows: function () {
    //     var key = '',
    //         rows = [];

    //     for (key in this.refs) {
    //         if (this.refs.hasOwnProperty(key) && key.indexOf('editorRow_') > -1) {
    //             rows.push(this.refs[key]);
    //         }
    //     }

    //     return rows;
    // },

    /**
     * @func _handleSaveButtonClick
     * @desc Handle saving updates to a LayoutComponent.
     * @todo Only save one binding (row).
     */
    _handleSaveButtonClick: function () {
        // var i = 0,
        //     rows = this._getRows(),
        //     binding = {};

        // // Extract row data and save it.
        // for (i; i < rows.length; i += 1) {
        //     // TODO: Only extract values which have been updated.
        //     binding[rows[i].getDOMNode().getAttribute('data-type')] = rows[i].state;
        // }

        // ComponentActions.update(this.props.componentdata.id, 'bindings', binding);

        // get the two sub-components to save their editing state. Each of these will trigger state changes as appropriate.
        // @todo will this dual trigger cause 2 renders? Perhaps get these methods to return their delta, which we merge and trigger.
        var componentProperties = this.refs.componentProperties,
            layoutProperties = this.refs.layoutProperties;

        componentProperties.saveChanges();
        layoutProperties.saveChanges();

        this.props.toggleModalEditor();
    },

    /**
     * @func _handleCancelButtonClick
     * @desc Handle canceling changes made in the editor.
     */
    _handleCancelButtonClick: function () {
        // var i = 0,
        //     rows = this._getRows();

        // // Reset each row's state
        // for (i; i < rows.length; i += 1) {
        //     rows[i].replaceState(rows[i].getInitialState());
        // }

        // get the two sub-components to cancel their editing state.
        var componentProperties = this.refs.componentProperties,
            layoutProperties = this.refs.layoutProperties;

        componentProperties.cancelChanges();
        layoutProperties.cancelChanges();

        // Close the modal
        this.props.toggleModalEditor();
    }
});

module.exports = EditorForm;
