/**
 * @file Drag and Drop event handlers for components.
 */

'use strict';

// Private function used for component specific conditionals.
function isPaletteComponent(self) {
    return self.props.layoutdata.id === void 0;
}

/**
 * Drag and drop event handlers. Not meant to be called directly.
 *
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
            componentData: this.props.layoutdata
        };

        if (isPaletteComponent(this) ||
            this._nodeBelongsToComponent(event.target) ||
            this.getDOMNode() === event.target) {
            event.dataTransfer.setData('text', JSON.stringify(data));
        }
    },

    /**
     * @func _handleDragOver
     * @desc By default, data/elements cannot be dropped on other elements. To allow a drop, we must prevent the default handling of the element.
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
        var data;

        if (this._nodeBelongsToComponent(event.target) || this.getDOMNode() === event.target) {
            data = JSON.parse(event.dataTransfer.getData('text'));

            // Check the type of component being dropped.
            if (data.componentType === "PaletteComponent") {
                this.props.addComponent(this.props.layoutdata.id, data.componentData.componentType);
            } else if (data.componentType === "LayoutComponent") {
                // Don't allow dropping parents onto children.
                if (!this._hasAncestor(data.componentData.id)) {
                    this.props.moveComponent(data.componentData.id, this.props.layoutdata.id);
                }
            }
        }
    }
};

module.exports = dragAndDropHandlers;