/**
 * @file Entry point to the application.
 */

'use strict';

var React = require('react'),
    Workspace = require('./component/workspace');

window.jQuery('#neolayout').entwine({
    onmatch: function () {
        React.render(
            <Workspace />,
            document.getElementById('workspace')
        );
    }
});
