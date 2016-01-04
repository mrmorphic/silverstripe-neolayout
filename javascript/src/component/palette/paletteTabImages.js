/**
 * Palette tab, specific to the Images tab which has non-standard UI
 */
'use strict';

var React = require('react'),
    PaletteTabImagesSearch = require('./paletteTabImagesSearch'),
    PaletteTabImagesResults = require('./paletteTabImagesResults'),
    AssetSearchService = require('../../services/AssetSearchService');

var PaletteTabImages = React.createClass({

    propTypes: {
        tabdef: React.PropTypes.object.isRequired,
        visible: React.PropTypes.bool.isRequired
    },

    // Initial state is an empty search. Only support title at the moment.
    getInitialState: function() {
        return {
            query: {
                title: ''
            }
        };
    },

    doSearch: function(query) {
        this.setState({
            query: query
        });
        AssetSearchService.imageSearch(query);
    },

    render: function () {
        var c = 'hidden';
        if (this.props.visible) {
            c = '';
        }

        return (
            <div className={c}>
                <PaletteTabImagesSearch query={this.state.query} onsearch={this.doSearch} />
                <PaletteTabImagesResults />
            </div>
        );
    }
});

module.exports = PaletteTabImages;
