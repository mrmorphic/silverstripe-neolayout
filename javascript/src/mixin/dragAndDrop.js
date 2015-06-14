/**
 * @file Drag and Drop event handlers for components.
 * @requires module:../action/ComponentActions
 */

'use strict';

var ComponentActions = require('../action/ComponentActions'),
    ComponentStore = require('../store/ComponentStore');

function isPaletteComponent(self) {
    return self.props.componentdata.id === void 0;
}

/**
 * @func validDrop
 * @param {string} targetId - ID of the drop target.
 * @param {string} componentId - ID of the component being dropped.
 * @return {boolean}
 * @desc Make sure the drop target is valid.
 */
function validDrop(targetId, componentId) {
    var isValid = true;

    if (ComponentStore.hasAncestor(targetId, componentId) || // Ancestor dropping onto a decendent
        targetId === componentId) { // Component dropping onto itself
        isValid = false;
    }

    return isValid;
}

/**
 * Drag and drop event handlers. Not meant to be called directly.
 * @mixin
 */
var dragAndDropHandlers = {
    /**
     * @func _handleDragStart
     * @desc Handle the drag event on components.
     */
    _handleDragStart: function (event) {
        var data = {
            componentType: isPaletteComponent(this) ? 'PaletteComponent' : 'LayoutComponent',
            componentData: this.props.componentdata
        };

        event.stopPropagation(); // Don't trigger the event on ancestor components.

        event.dataTransfer.setData('text', JSON.stringify(data));
    },

    /**
     * @func _handleDragOver
     * @desc Drag and drop behaviour is opt-in. To enable a drop, we must prevent the default handling of the element.
     */
    _handleDragOver: function (event) {
        if (!isPaletteComponent(this)) {
            event.preventDefault();
        }
    },

    /**
     * @func _handleDrop
     * @desc Handle the drop event of a component.
     */
    _handleDrop: function (event) {
        var dragData = JSON.parse(event.dataTransfer.getData('text')),
            dropId = event.target.getAttribute('data-componentid');

        event.stopPropagation(); // Don't trigger the event on ancestor components.

        switch(dragData.componentType) {
            case 'PaletteComponent':
                ComponentActions.create({
                    parent: dropId,
                    ClassName: dragData.componentData.componentType
                });
                break;
            case 'LayoutComponent':
                if (validDrop(dropId, dragData.componentData.id)) {
                    ComponentActions.update(dragData.componentData.id, 'parent', dropId);
                }
                break;
        }
    }
};

module.exports = dragAndDropHandlers;
