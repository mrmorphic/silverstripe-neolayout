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
        addWorkspaceField: React.PropTypes.func.isRequired,
        moveWorkspaceField: React.PropTypes.func.isRequired
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
                        addWorkspaceField={this.props.addWorkspaceField}
                        moveWorkspaceField={this.props.moveWorkspaceField} />
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
     * @func _nodeBelongsToField
     * @param {Object} node A DOM node
     * @return {Boolean}
     * @desc Check if a DOM node is part of a WorkspaceField.
     */
    _nodeBelongsToField: function (node) {
        var $node = $(node);

        return $node.data('uuid') === this.props.data.id ||
            $node.closest('.nl-workspace-field').data('uuid') === this.props.data.id;
    },

    /**
     * @func _handleDragStart
     * @desc Handle the drag event on WorkspaceField's
     */
    _handleDragStart: function (event) {
        var data = {
            fieldType: "WorkspaceField",
            fieldData: this.props.data
        };

        if (this._nodeBelongsToField(event.target)) {
            event.dataTransfer.setData('text', JSON.stringify(data));
        }
    },

    /**
     * @func _hasAncestor
     * @param {String} id
     * @desc Check if the current WorkspaceField has an ancestor matching a WorkspaceField ID.
     * @todo Do this via React rather than DOM.
     */
    _hasAncestor: function (id) {
        return ($.contains($('[data-uuid="' + id + '"]')[0], this.getDOMNode()));
    },

    /**
     * @func _handleDrop
     * @desc Handle the drop event on a WorkspaceField. Handles dropping of PaletteField's and other WorkspaceField's.
     */
    _handleDrop: function (event) {
        var data;

        if (this._nodeBelongsToField(event.target)) {
            data = JSON.parse(event.dataTransfer.getData('text'));

            // Check the type of field being dropped.
            if (data.fieldType === "PaletteField") {
                this.props.addWorkspaceField({
                    parentId: this.props.data.id,
                    fieldType: data.fieldData.componentType
                });
            } else if (data.fieldType === "WorkspaceField") {
                // Don't allow dropping parents onto children.
                if (!this._hasAncestor(data.fieldData.id)) {
                    this.props.moveWorkspaceField({
                        fieldId: data.fieldData.id, // Field that's moving
                        toId: this.props.data.id // Parent element we're moving to
                    });
                }
            }
        }
    },

    render: function () {
        var childFields = this.createChildFields();

        return (
            <div
                className="nl-component nl-workspace-field"
                data-uuid={this.props.data.id}
                draggable="true"
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._allowDrop}>

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
