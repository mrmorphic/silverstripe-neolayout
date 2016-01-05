var MetadataActions = require('../action/MetadataActions'),
    MetadataStore = require('../store/MetadataStore');

// A service for image searches
var AssetSearchService = {

    // Given a query, find images that match. Query is an object of the following form:
    //  {
    //      title: value,
    //      page: 2
    //  }
    // If page is not set, it defaults to 0, which is the first page of results. The service determines
    // the number of items per page. This initiates the query, and invokes MetadataActions.imageSearchResults.
    imageSearch: function(query) {
        var url = this.getAPIBaseURL() + 'imageSearch';

        if (!query.page) {
            query.page = 0;
        }

        jQuery.ajax(url, {
            cache: false,
            data: query,
            error: function(jqXHR, textStatus, errorThrown) {
                // MetadataActions.fetchError(errorThrown);
            },
            success: function(data, textStatus, jqXHR) {
                MetadataActions.imageSearchResults(JSON.parse(data));
            }
        })
    },

    getAPIBaseURL: function() {
        // @todo fix this coupling. The service should not need to know about DOM structure. Perhaps a config store populated by workspace.
        return document.getElementById('neolayout').getAttribute('data-api-base') + '/';
    }
};

module.exports = AssetSearchService;













