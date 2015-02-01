/**
 * @file Drag and Drop event handlers for components.
 * @requires module:jQuery
 */

'use strict';

var $ = require('jquery');

/**
 * Various utility methods for components. Not meant to be called directly.
 *
 * @mixin
 */
var util = {
    /**
     * @func _nodeBelongsToComponent
     * @param {Object} node A DOM node
     * @return {Boolean}
     * @desc Check if a DOM node is part of a WorkspaceField.
     */
    _nodeBelongsToComponent: function (node) {
        var $node = $(node);

        return $node.data('uuid') === this.props.layoutdata.id ||
            $node.closest('.nl-layout-component').data('uuid') === this.props.layoutdata.id;
    },

    /**
     * @func _hasAncestor
     * @param {String} id
     * @desc Check if the current LayoutComponent has an ancestor matching an ID.
     * @todo Do this via React rather than DOM.
     */
    _hasAncestor: function (id) {
        return ($.contains($('[data-uuid="' + id + '"]')[0], this.getDOMNode()));
    },

    /**
     * @func _componentHasChildren
     * @param {Object} component
     * @return {Boolean}
     * @desc Check if a component has child components.
     */
    _componentHasChildren: function (component) {
        return component.children !== void 0 && component.children.length > 0;
    }
};

module.exports = util;
