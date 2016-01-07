/**
 * Palette tab (generic)
 */

'use strict';

var React = require('react');

var EditorTab = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool.isRequired
    },

    render: function () {
        var c = 'nl-editor-tab';
        if (this.props.selected) {
            c += ' selected';
        }

        return (
            <li className={c}>
                <a href="javascript:void(0)" onClick={this.props.onClick}>
                    {this.props.title}
                </a>
            </li>
        );
    }
});

module.exports = EditorTab;
