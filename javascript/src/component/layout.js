/**
 * @file A Layout is made up of one or more LayoutComponents.
 * @module Layout
 * @requires module:react
 * @requires module:./layoutComponent
 * @requires module:../store/ComponentStore
 */

'use strict';

var React = require('react'),
    LayoutComponent = require('./layoutComponent'),
    ComponentStore = require('../store/ComponentStore');

var Layout = React.createClass({

    propTypes: {
        metadata: React.PropTypes.object.isRequired,
        components: React.PropTypes.object.isRequired
    },

    render: function () {
        var rootComponent = this._createRootComponent();

        if (rootComponent === null) {
            return (
                <p>No layout components to render.</p>
            );
        }

        return (
            <div className="nl-layout">
                <h2>Layout</h2>
                {rootComponent}
            </div>
        );
    },

    /**
     * @func _createRootComponent
     * @return {object}
     */
    _createRootComponent: function () {
        var rootComponent = ComponentStore.getRootComponent();

        if (rootComponent === void 0) {
            return null;
        }

        return (
            <LayoutComponent
                key={rootComponent.id}
                componentdata={rootComponent}
                metadata={this.props.metadata} />
        );
    }
});

module.exports = Layout;
