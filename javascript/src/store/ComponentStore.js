/**
 * @file The store for components within the application.
 * @module ComponentStore
 * @requires module:../dispatcher/AppDispatcher
 * @requires module:events
 * @requires module:../constants/ComponentConstants
 * @requires module:object-assign
 * @requires module:node-uuid
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    ComponentConstants = require('../constants/ComponentConstants'),
    assign = require('object-assign'),
    uuid = require('node-uuid');

var CHANGE_EVENT = 'change';

var _components = {}; // collection of components

/**
 * @func create
 * @param {object} data - The data to populate the component with.
 * @param {string} [data.id] - ID of the component. If undefined an ID will be generated.
 * @param {string} data._parent - ID of the LayoutComponent we're adding the new LayoutComponent to.
 * @param {string} data.componentType - Type of LayoutComponent we're adding.
 * @param {object} data.bindings
 * @param {array} [data.children] - Child components.
 * @desc Add a component and its children to the store.
 */
function create(data) {
    var id = data.id !== void 0 ? data.id : uuid.v4(),
        bindings = data.bindings !== void 0 ? data.bindings : [],
        i = 0;

    if (_components[id] !== void 0) {
        return;
    }

    var obj = {
        id: id
    };
    // Copy everything from source except children and id.
    for (prop in data) {
        if (prop != 'children' && prop != 'id') {
            obj[prop] = data[prop];
        }
    }
    _components[id] = obj;

    // Create child components
    if (data.children !== void 0 && data.children.length > 0) {
        for (i; i < data.children.length; i +=1) {
            data.children[i]._parent = id;
            create(data.children[i]);
        }
    }
}

/**
 * @func destroy
 * @param {string} id - The ID of the LayoutComponent to remove.
 * @desc Revomes a LayoutComponent and all of it's children from the Layout.
 */
function destroy(id) {
    if (_components[id] === void 0) {
        return;
    }

    delete _components[id];
}

/**
 * @func update
 * @param {string} id - The id of the LayoutComponent you want to update.
 * @param {string} key - The key to update
 * @param {*} value - The new value.
 * @desc Update a component's property
 */
function update(id, key, value) {
    if (_components[id] === void 0) {
        return;
    }

    _components[id][key] = value;
}

var ComponentStore = assign({}, EventEmitter.prototype, {
    /**
     * @return {object}
     * @desc Get the entire collection of Components.
     */
    getAll: function () {
        return _components;
    },

    /**
     * @func getRootComponent
     * @return {object|null}
     */
    getRootComponent: function () {
        for (var prop in _components) {
            if (_components.hasOwnProperty(prop)) {
                if (_components[prop]._parent === null) {
                    return _components[prop];
                }
            }
        }

        return null;
    },

    /**
     * @func getById
     * @param {string} id
     * @return {object}
     */
    getById: function (id) {
        return _components[id];
    },

    // Return a component's parent component, or null if there isn't one.
    getParent: function(component) {
        return this.getById(component._parent);
    },

    /**
     * @func getChildren
     * @param {string} id - The id of the parent
     * @return {array}
     * @desc Get children of a component
     */
    getChildren: function (id) {
        var children = [];

        for (var prop in _components) {
            if (_components.hasOwnProperty(prop)) {
                if (_components[prop]._parent === id) {
                    children.push(_components[prop]);
                }
            }
        }

        return children;
    },

    /**
     * @func hasAncestor
     * @param {string} componentId
     * @param {string} ancestorId
     */
    hasAncestor: function (componentId, ancestorId) {
        var hasAncestor = true,
            component = _components[componentId];

        if (component === void 0) {
            hasAncestor = false;
        } else if (component._parent !== ancestorId) {
            hasAncestor = this.hasAncestor(component._parent, ancestorId);
        }

        return hasAncestor;
    },

    /**
     * @func _isRoot
     * @param {string} id - The id of the LayoutComponent we're checking.
     * @return {boolean}
     * @desc Determine if a LayoutComponent is the root component.
     */
    isRoot: function (id) {
        return _components[id] !== void 0 && _components[id]._parent === null;
    },

    /**
     * @func canEdit
     * @param {string} id
     * @return {boolean}
     * @desc Returns true if the user is able to edit the field.
     */
    canEdit: function (id) {
        return true;
    },

    /**
     * @func canRemove
     * @param {string} id
     * @return {boolean}
     * @desc Returns true if the user is able to remove the LayoutComponent from the Layout.
     */
    canRemove: function (id) {
        return this.isRoot(id) === false;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function (payload) {
    switch(payload.action) {
        case ComponentConstants.COMPONENT_CREATE:
            create(payload.data);
            ComponentStore.emitChange();
            break;

        case ComponentConstants.COMPONENT_DESTROY:
            destroy(payload.data.id);
            ComponentStore.emitChange();
            break;

        case ComponentConstants.COMPONENT_UPDATE:
            update(payload.data.id, payload.data.key, payload.data.value);
            ComponentStore.emitChange();
            break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = ComponentStore;
