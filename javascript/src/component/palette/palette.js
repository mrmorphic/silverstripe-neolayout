/**
 * @file Palette top-level component
 */
'use strict';

var React = require('react'),
    PaletteTab = require('./paletteTab'),
    PaletteTabGeneric = require('./paletteTabGeneric'),
    PaletteTabImages = require('./paletteTabImages');

// Palette component is the top-level palette holder, which renders the palette tab components.
var Palette = React.createClass({

    propTypes: {
        palette: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return {
            selectedTab: 0
        }
    },

    selectTab: function(tabIndex) {
        this.setState({
            selectedTab: tabIndex
        });
    },

    render: function () {
        var paletteTabs = [],
            paletteTabContents = [];

        for (var i = 0; i < this.props.palette.length; i++) {
            var tab = this.props.palette[i],
                selected = false;

            if (i === this.state.selectedTab) {
                selected = true;
            }

            var boundClick = this.selectTab.bind(this, i);

            paletteTabs.push(
                <PaletteTab tabdef={tab} onClick={boundClick} selected={selected} key={i} />
            );
            switch (tab.type) {
                case 'images':
                    paletteTabContents.push(
                        <PaletteTabImages className="nl-palette-tab" visible={selected} tabdef={tab} key={i} />
                    );
                    break;
                default:
                    paletteTabContents.push(
                        <PaletteTabGeneric className="nl-palette-tab" visible={selected} tabdef={tab} key={i} />
                    );
                    break;
            }
        }

        return (
            <div className="nl-palette">
                <h2>Palette</h2>
                <ul>
                    {paletteTabs}
                </ul>
                <div className="nl-palette-container">
                    {paletteTabContents}
                </div>
            </div>
        );
    }
});

module.exports = Palette;
