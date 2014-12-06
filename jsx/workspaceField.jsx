/**
 * @file The core component used to create layouts.
 * @module WorkspaceField
 */

'use strict';

var $ = require('jquery'),
    React = require('react'),
    FieldEditor = require('./fieldEditor');

var WorkspaceField = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        metadata: React.PropTypes.object.isRequired,
        updateFieldData: React.PropTypes.func.isRequired,
        removeFieldFromWorkspace: React.PropTypes.func.isRequired,
        fieldIsRoot: React.PropTypes.func.isRequired,
        addWorkspaceField: React.PropTypes.func.isRequired
    },

    /**
     * @func canEdit
     * @return {Boolean}
     * @desc Returns true if the user is able to edit the field.
     */
    canEdit: function () {
        return true;
    },

    /**
     * @func canRemove
     * @return {Boolean}
     * @desc Returns true if the user is able to remove the field from the workspace.
     */
    canRemove: function () {
        return this.props.fieldIsRoot(this.props.data.id) === false;
    },

    /**
     * @func createChildFields
     * @return {Array} Child layout fields of the current WorkspaceField.
     * @desc Create the child components for the current WorkspaceField.
     */
    createChildFields: function () {
        var childFields = null,
            i = 0;

        if (typeof this.props.data.children !== 'undefined') {
            childFields = [];

            for (i; i < this.props.data.children.length; i +=1) {
                childFields.push(
                    <WorkspaceField
                        key={i}
                        data={this.props.data.children[i]}
                        metadata={this.props.metadata}
                        updateFieldData={this.props.updateFieldData}
                        removeFieldFromWorkspace={this.props.removeFieldFromWorkspace}
                        fieldIsRoot={this.props.fieldIsRoot}
                        addWorkspaceField={this.props.addWorkspaceField} />
                );
            };
        }

        return childFields;
    },

    /**
     * @func _allowDrop
     * @desc By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
     */
    _allowDrop: function (event) {
        event.preventDefault();
    },

    /**
     * @func _handleDrop
     * @desc Handle dropping PaletteField's onto the WorkspaceField.
     */
    _handleDrop: function (event) {
        // This function gets called once for every WorkspaceField in the target
        // node's parent chain. So if the WorkspaceField recieving the drop event
        // is nested inside another WorkspaceField, _handleDrop will get call on
        // on both WorkspaceField's. So we only care about the the WorkspaceField
        // that is closest to event.target.

        var $target = $(event.target);

        if ($target.data('uuid') === this.props.data.id ||
            $target.closest('.nl-workspace-field').data('uuid') === this.props.data.id) {

            this.props.addWorkspaceField({
                parentId: this.props.data.id,
                fieldType: event.dataTransfer.getData('text')
            });
        }
    },

    render: function () {
        var childFields = this.createChildFields();

        return (
            <div className="nl-component nl-workspace-field" onDrop={this._handleDrop} onDragOver={this._allowDrop} data-uuid={this.props.data.id}>
                <h3>{this.props.data.ClassName}</h3>
                <FieldEditor
                    data={this.props.data}
                    metadata={this.props.metadata}
                    updateFieldData={this.props.updateFieldData}
                    removeFieldFromWorkspace={this.props.removeFieldFromWorkspace}
                    canEdit={this.canEdit}
                    canRemove={this.canRemove} />

                {childFields}
            </div>
        );
    }
});

module.exports = WorkspaceField;
