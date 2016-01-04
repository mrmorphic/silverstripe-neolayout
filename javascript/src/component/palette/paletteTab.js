/**
 * Palette tab (generic)
 */

'use strict';

var React = require('react');

var PaletteTab = React.createClass({

    propTypes: {
        tabdef: React.PropTypes.object.isRequired,
        selected: React.PropTypes.bool.isRequired
    },

    render: function () {
        var c = 'nl-palette-tab';
        if (this.props.selected) {
            c += ' selected';
        }

        return (
            <li className={c}>
                <a href="javascript:void(0)" onClick={this.props.onClick}>
                    {this.props.tabdef.title}
                </a>
            </li>
        );
    }
});

module.exports = PaletteTab;
