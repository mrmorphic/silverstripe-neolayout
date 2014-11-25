'use strict';

var React = require('react'),
    Palette = require('./palette'),
    Workspace = require('./workspace');

window.jQuery('#neolayout').entwine({
    onmatch: function () {
        var rootElement = document.getElementById('neolayout'),
            metadata = JSON.parse(rootElement.getAttribute('data-metadata')),
            workspaceData = JSON.parse(rootElement.getAttribute('data-workspace'));

        React.render(
            <Palette metadata={metadata} />,
            document.getElementById('palette')
        );

        React.render(
            <Workspace data={workspaceData} metadata={metadata} />,
            document.getElementById('workspace')
        );
    }
});
