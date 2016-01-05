/**
 * Palette images search results
 */
'use strict';

var React = require('react'),
    PaletteComponent = require('./paletteComponent'),
    MetadataStore = require('../../store/MetadataStore');

var PaletteTabImagesSearch = React.createClass({

    render: function () {
        var searchResults = MetadataStore.getImageSearchResults(),
            resultComponent;

        // if there is no query, no search has occurred.
        if (!searchResults.items) {
            resultComponent = (
                <span>Search to find images</span>
            );
        } else if (searchResults.items.length == 0) {
            resultComponent = (
                <span>No matching images found</span>
            )
        } else {
            resultComponent = [];
            for (var i = 0; i < searchResults.items.length; i++) {
                var item = searchResults.items[i],
                    component = {
                        '_title': item.Title,
                        '_thumbnailUrl': item.ThumbnailURL,
                        'componentType': 'NLImageComponent',
                        'bindings': {
                            'InternalImage': {
                                "type": "embedded",
                                "value": 'Image:' + item.ID
                            }
                        }
                    };

                resultComponent.push(
                    <PaletteComponent componentdata={component} />
                );
            }
        }

        return (
            <div className="images-search-results">
                {resultComponent}
            </div>
        );
    }
});

module.exports = PaletteTabImagesSearch;
