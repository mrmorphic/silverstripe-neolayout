/**
 * Layout manager interface. The client-side uses this to handle behaviours that must be decided by the
 * layout manager. This is basically a dispatcher to a layout manager implementation. It uses
 * server-generated configuration to determine which class to use.
 */

'use strict';

// @todo this should be more dynamic, or should be injected or injectable.
var LayoutManagerBootstrap = require('./layoutmanager/layoutManagerBootstrap'),
    MetadataStore = require('../store/MetadataStore');

// This is the layout manager instance we're using, populated on demand.
var _layoutManager = null;

var LayoutManager = {

    getImplementor: function() {
        if (!_layoutManager) {
            // determine which to use. Right now, it's real easy :-P
            _layoutManager = LayoutManagerBootstrap;
        }
        return _layoutManager;
    },

    // Get a property editor to edit a component.
    getPropertyEditor: function(component) {
        var lm = this.getImplementor();
        return lm.getPropertyEditor(component);
    }
};

module.exports = LayoutManager;
