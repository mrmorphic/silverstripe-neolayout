/**
 * @file Workspace is the base component of NeoLayout.
 * @module Workspace
 * @requires module:react
 * @requires module:./palette
 * @requires module:./layout
 */

'use strict';

var React = require('react'),
    Palette = require('./palette'),
    Layout = require('./layout');

var Workspace = React.createClass({
    render: function () {
        var metadata = JSON.parse(document.getElementById('neolayout-data').getAttribute('data-metadata'));

        return (
            <div>
                <Palette metadata={metadata} />
                <Layout metadata={metadata} />
            </div>
        );
    }
});

module.exports = Workspace;
