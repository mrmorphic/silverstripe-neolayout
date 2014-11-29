/**
 * @file Entry point to the application.
 */

'use strict';

var React = require('react'),
    Palette = require('./palette'),
    Workspace = require('./workspace');

window.jQuery('#neolayout').entwine({
    onmatch: function () {
        var metadata = JSON.parse(document.getElementById('neolayout-data').getAttribute('data-metadata')),
            workspaceData = JSON.parse(document.getElementById('Form_EditForm_EditableLayout').value);

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
