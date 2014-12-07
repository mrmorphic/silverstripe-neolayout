/**
 * @file A field which can be added to the Workspace.
 * @module PaletteField
 */

'use strict';

var React = require('react');

var PaletteField = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    /**
     * @func _handleDragStart
     * @desc Handle the drag event on PaletteField's
     */
    _handleDragStart: function (event) {
        var data = {
            fieldType: "PaletteField",
            fieldData: this.props.data
        };

        event.dataTransfer.setData('text', JSON.stringify(data));
    },

    render: function () {
        return (
            <div className="nl-component nl-palette-field" draggable="true" onDragStart={this._handleDragStart}>
                <p><strong>{this.props.data.name}</strong></p>
                <p>{this.props.data.description}</p>
            </div>
        );
    }
});

module.exports = PaletteField;
