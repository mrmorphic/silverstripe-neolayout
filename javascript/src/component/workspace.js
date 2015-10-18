/**
 * @file Workspace is the base component of NeoLayout.
 * @module Workspace
 * @requires module:react
 * @requires module:./palette
 * @requires module:./layout
 * @requires module:../store/ComponentStore
 * @requires module:../action/ComponentActions
 */

'use strict';

var React = require('react'),
    Palette = require('./palette'),
    Layout = require('./layout'),
    ComponentStore = require('../store/ComponentStore'),
    ComponentActions = require('../action/ComponentActions');

/**
 * @func getComponentState
 * @private
 * @return {object}
 * @desc Factory for the Worspace's state object.
 */
function getComponentState() {
    return {
        components: ComponentStore.getAll()
    };
}

var Workspace = React.createClass({

    getInitialState: function () {
        this._populateStore();

        return getComponentState()
    },

    componentDidMount: function () {
        ComponentStore.addChangeListener(this._onChange);
    },

    componentDidUnmount: function () {
        ComponentStore.removeChangeListener(this._onChange);
    },

    render: function () {
        var metadata = JSON.parse(document.getElementById('neolayout-data').getAttribute('data-metadata'));

        return (
            <div>
                <Palette metadata={metadata} />
                <Layout metadata={metadata} components={this.state.components} />
            </div>
        );
    },

    /**
     * @func _onChange
     * @desc Called when the ComponentStore is modified.
     */
    _onChange: function () {
        this.setState(getComponentState());
        this._save();
    },

    /**
     * @func _populateStore
     * @desc Populates the ComponentStore with data from the database.
     */
    _populateStore: function () {
        var data = JSON.parse(document.getElementById('Form_EditForm_EditableLayout').value);

        ComponentActions.create({
            id: data.id,
            parent: null,
            type: data.ClassName,
            bindings: data.bindings,
            children: data.children
        });
    },

    /**
     * @func _transformComponentsForSave
     * @param {object} component - The root component to transform.
     * @return {string} - JSON representation of the Workspace's state.
     * @desc The Workspace's state needs to be formatted into a component hierarchy
     * and transformed to JSON so it can be saved to the database.
     */
    _transformComponentsForSave: function (component) {
        var i = 0;

        component.children = ComponentStore.getChildren(component.id);

        if (component.children.length > 0) {
            for (i; i < component.children.length; i += 1) {
                component.children[i] = this._transformComponentsForSave(component.children[i]);
            }
        }

        return component;
    },

    /**
     * @func save
     * @desc Writes changes to the DOM so that changes are persisted to the database
     * when the page is saved.
     */
    _save: function () {
        // Clone the root component
        var rootComponent = JSON.parse(JSON.stringify(ComponentStore.getRootComponent()));

        // Format and convert the Workspace's state to JSON, ready for writing to the DOM.
        var json = JSON.stringify(this._transformComponentsForSave(rootComponent));

        document.getElementById('Form_EditForm_EditableLayout').value = json;
    }
});

module.exports = Workspace;
