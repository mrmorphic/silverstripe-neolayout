/**
 * @file The store for metadata. This includes information about the context, including palette data.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    MetadataConstants = require('../constants/MetadataConstants');

var _context = {};
var _palette = [];
var _componentTypes = [];
var _imageSearchResults = {};

var UPDATED_EVENT = 'updated';

function storeMetadata(data) {
	_context = data.context;
	_palette = data.palette;
	_componentTypes = data.componentTypes;
}

function storeImageSearch(data) {
    _imageSearchResults = data;
}

var MetadataStore = assign({}, EventEmitter.prototype, {
	// Get the palette of available options.
	getPalette: function() {
		return _palette;
	},

	// Get properties defined in the context.
	getContext: function() {
		return _context;
	},

	getComponentTypes: function() {
		return _componentTypes;
	},

    getImageSearchResults: function() {
        return _imageSearchResults;
    },

    // Helper function to return a component from _componentTypes given it's ClassName
    getComponentByType: function(className) {
        for (var i = 0; i < _componentTypes.length; i++) {
            if (_componentTypes[i].componentType == className) {
                return _componentTypes[i];
            }
        }
        return null;
    },

    emitChange: function () {
        this.emit(UPDATED_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(UPDATED_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(UPDATED_EVENT, callback);
    }

});

AppDispatcher.register(function (payload) {
    switch(payload.action) {
        case MetadataConstants.SET_CONTEXT_METADATA:
        	storeMetadata(payload.data);
            MetadataStore.emitChange();
            break;
        case MetadataConstants.IMAGE_SEARCH_RESULTS:
            storeImageSearch(payload.data);
            MetadataStore.emitChange();
    }

    return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = MetadataStore;
