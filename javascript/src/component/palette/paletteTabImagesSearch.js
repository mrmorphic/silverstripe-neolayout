/**
 * Palette images search toolbar
 */
'use strict';

var React = require('react');

var PaletteTabImagesSearch = React.createClass({

    propTypes: {
        query: React.PropTypes.object.isRequired,
        onsearch: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            query: this.props.query
        };
    },

    // handles click by constructing a new query object and passing it to the onsearch handler
    onSearchClick: function() {
        this.props.onsearch(this.state.query);
    },

    onSearchChange: function() {
        var query = {
            title: this.refs.titleSearch.getDOMNode().value
        };
        this.setState({
            query: query
        });
    },

    render: function () {
        return (
            <div className="images-search-toolbar">
                <input name="image-title-search" type="text" ref="titleSearch" value={this.state.query.title} onChange={this.onSearchChange}/>
                <button type="button" onClick={this.onSearchClick}>Search</button>
            </div>
        );
    }
});

module.exports = PaletteTabImagesSearch;
