/**
 * @file Actions for metadata
 * @module ComponentActions
 * @requires module:../dispatcher/AppDispatcher
 * @requires module:../constants/ComponentConstants
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    MetadataConstants = require('../constants/MetadataConstants');

var MetadataActions = {
    // Populate the initial context metadata, typically done during app initialisation.
    setContextMetadata: function(data) {
        AppDispatcher.dispatch({
            action: MetadataConstants.SET_CONTEXT_METADATA,
            data: data
        });
    },

    // Invoked when there are updated image search results
    imageSearchResults: function(results) {
    	AppDispatcher.dispatch({
    		action: MetadataConstants.IMAGE_SEARCH_RESULTS,
    		data: results
    	})
    }
};

module.exports = MetadataActions;
