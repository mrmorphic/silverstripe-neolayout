/**
 * @file Actions for components
 * @module ComponentActions
 * @requires module:../dispatcher/AppDispatcher
 * @requires module:../constants/ComponentConstants
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ComponentConstants = require('../constants/ComponentConstants');

var ComponentActions = {
    /**
     * @func create
     * @param {object} data
     * @param {string} [data.id]
     * @param {string} [data.parent] - The ID of the parent component.
     * @param {string} data.ClassName
     * @param {object} [data.bindings]
     * @param {array} [data.children]
     */
    create: function (data) {
        AppDispatcher.dispatch({
            action: ComponentConstants.COMPONENT_CREATE,
            data: {
                id: data.id,
                parent: data.parent,
                ClassName: data.ClassName,
                bindings: data.bindings,
                children: data.children
            }
        });
    },

    /**
     * @func destroy
     * @param {string} id
     */
    destroy: function (id) {
        AppDispatcher.dispatch({
            action: ComponentConstants.COMPONENT_DESTROY,
            data: {
                id: id
            }
        });
    },

    /**
     * @func update
     * @param {string} id - The component to update.
     * @param {string} key - The property to update.
     * @param {string|number|object|array|null} value - The new value.
     */
    update: function (id, key, value) {
        AppDispatcher.dispatch({
            action: ComponentConstants.COMPONENT_UPDATE,
            data: {
                id: id,
                key: key,
                value: value
            }
        });
    }
};

module.exports = ComponentActions;
