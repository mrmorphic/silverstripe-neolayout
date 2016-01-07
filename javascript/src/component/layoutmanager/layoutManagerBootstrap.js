/**
 * Palette tab (generic)
 */

'use strict';

var React = require('react');

// Handle client-side 
var LayoutManagerBootstrap = {

    // Get a property editor form for the specified component. The form will have the properties that
    // are supported for bootstrap layout. The properties present will be a function of the component and
    // it's parent.
    getPropertyEditor: function(component) {
        // Get the sections of the editor form
        var sizeFields = this.getSizeFields(component),
            responsiveFields = this.getResponsiveFields(component);

        // put it all together.
        return (
            <div className="nl-bootstrap-lm-fields">
                {sizeFields}
                {responsiveFields}
            </div>
        );
    },

    // Get editor fields to support sizing. These are generally dependent on the parent. Typically, only
    // children of horizontal boxes needs size info, which is the column width and offsets, etc.
    getSizeFields: function(component) {
        var props = [];

        return (
            <div className="lm-size-properties">
                <h4>Sizing</h4>
                {props}
            </div>
        );
    },

    // Get editor fields to support responsive. These are always present.
    getResponsiveFields: function(component) {
        return (
            <div className="lm-size-properties">
                <h4>Responsive</h4>
                <div>Visible on:</div>
                <div>
                    <input type="checkbox" />&nbsp;large devices
                </div>
                <div>
                    <input type="checkbox" />&nbsp;medium devices
                </div>
                <div>
                    <input type="checkbox" />&nbsp;small devices
                </div>
                <div>
                    <input type="checkbox" />&nbsp;extra small devices
                </div>
            </div>
        );
    }
};

module.exports = LayoutManagerBootstrap;
