'use strict';

var $ = require('jquery'),
    React = require('react'),
    Palette = require('./palette'),
    Workspace = require('./workspace');

var metadata = $('#neolayout').data('metadata'),
    workspaceData = $('#neolayout').data('workspace');

React.render(
    <Palette data={metadata} />,
    document.getElementById('palette')
);

React.render(
    <Workspace data={workspaceData} metadata={metadata} />,
    document.getElementById('workspace')
);
