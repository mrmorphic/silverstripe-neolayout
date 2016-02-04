/**
 * Palette tab (generic)
 */

'use strict';

var React = require('react'),
    LMBootstrapDropdown = require('./lmBootstrapDropdown'),
    ComponentStore = require('../../store/ComponentStore');

// Handle client-side 
var LayoutManagerBootstrap = {

    sizeInfo: [
        {
            size: 'lg',
            label: 'large'
        },
        {
            size: 'md',
            label: 'medium'
        },
        {
            size: 'sm',
            label: 'small'
        },
        {
            size: 'xs',
            label: 'extra small'
        }
    ],

    // Used by the layout editor consider to initialise it's state, which we in turn use to manage the editing state,
    // separate from the layout property of the component being edited. This flattens the layout properties as well,
    // which makes the binding easier. Note this results is a separate object that is bound to, which can be discarded for
    // cancel, or written back to the layout property by saveStateToComponent.
    getInitialState: function(propEditor) {
        var o = {},
            c = propEditor.props.componentdata,
            l = c.layout && c.layout.bootstrap ? c.layout.bootstrap : {},
            cols = l.columns ? l.columns : {},
            vis = l.visibility ? l.visibility : {};

        o.lgWidth = cols.lg && cols.lg.width ? cols.lg.width : '';
        o.mdWidth = cols.md && cols.md.width ? cols.md.width : '';
        o.smWidth = cols.sm && cols.sm.width ? cols.sm.width : '';
        o.xsWidth = cols.xs && cols.xs.width ? cols.xs.width : '';

        o.lgVis = vis.lg || '';
        o.mdVis = vis.md || '';
        o.smVis = vis.sm || '';
        o.xsVis = vis.xs || '';

        return o;
    },

    // write propEditor.state, which was initialised from the component by getInitialState, back to the component.
    saveStateToComponent: function(propEditor) {
        console.log('save: before: ', propEditor.props.componentdata);

        var hasColumns = false,
            state = propEditor.state,
            columns = {},
            vis = {};

        var result = {
            bootstrap: {}
        }

        // determine the sizes, if any
        hasColumns |= this.mergeColumn(columns, state.lgWidth, 'lg');
        hasColumns |= this.mergeColumn(columns, state.mdWidth, 'md');
        hasColumns |= this.mergeColumn(columns, state.smWidth, 'sm');
        hasColumns |= this.mergeColumn(columns, state.xsWidth, 'xs');

        if (hasColumns) {
            result.bootstrap.columns = columns;
        }

        // determine visibility properties
        this.mergeVisibility(vis, state.lgVis, 'lg');
        this.mergeVisibility(vis, state.mdVis, 'md');
        this.mergeVisibility(vis, state.smVis, 'sm');
        this.mergeVisibility(vis, state.xsVis, 'xs');

        result.bootstrap.visibility = vis;

        propEditor.props.componentdata.layout = result;
    },

    mergeColumn: function(columns, width, size) {
        if (width == '') {
            return false;
        }

        columns[size] = {
            width: width
        };

        return true;
    },

    mergeVisibility: function(result, vis, size) {
        if (vis == '') {
            return;
        }

        result[size] = vis;
    },

    // Get a property editor form for the specified propEditor react component. The form will have the properties that
    // are supported for bootstrap layout. The properties present will be a function of the component and
    // it's parent.
    // The component being edited is propEditor.props.componentdata
    getPropertyEditor: function(propEditor) {
        var component = propEditor.props.componentdata,

            // Get the sections of the editor form
            sizeFields = this.getSizeFields(propEditor, component),
            responsiveFields = this.getResponsiveFields(propEditor, component);

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
    getSizeFields: function(propEditor, component) {
        var parent = ComponentStore.getParent(component),
            props = [],
            sizeOptions = [];

        // @todo generalise to include subclasses as well.
        // Only return sizing properties if the parent is a horizontal box; column widths and offsets are
        if (parent == null || parent.componentType != 'NLHorizontalBoxLayout') {
            return (
                <div/>
            )
        }

        var sizeOptions = this.getSizeOptions();

        for (var i = 0; i < this.sizeInfo.length; i++) {
            var sz = this.sizeInfo[i],
                widthLabel = sz.label + ' width (columns)',
                pr = sz.size + 'Width',
                sizeOptions = this.getSizeOptions();

            props.push(
                <LMBootstrapDropdown
                    key={i}
                    label={widthLabel}
                    value={propEditor.state[pr]}
                    onChange={this._handleSizeChange}
                    propEditor={propEditor}
                    property={pr}
                    options={sizeOptions}/>
            );
        }

        // 
        return (
            <div className="lm-size-properties">
                <h4>Sizing</h4>
                {props}
            </div>
        );
    },

    _handleSizeChange: function(event, size) {
        console.log(event);
        var size = event.target.getAttribute('data-size');
        console.log(size);
        var pr = size + 'Width';
        var o = {
        };
        o[pr] = event.target.value;
        propEditor.setState(o);

    },

    getSizeOptions: function() {
        var result = [];

        result.push(
            <option value="" key={0}>none</option>
        );
        for (var i = 1; i <= 12; i++) {
            result.push(
                <option value={i} key={i}>{i}</option>
            );
        }

        return result;
    },

    // Get editor fields to support responsive. These are always present.
    getResponsiveFields: function(propEditor, component) {
        var props = [];
        for (var i = 0; i < this.sizeInfo.length; i++) {
            var sz = this.sizeInfo[i],
                label = sz.label,
                pr = sz.size + 'Vis',
                visibilityOptions = this.getVisibilityOptions();

            props.push(
                <LMBootstrapDropdown
                    key={i}
                    label={label}
                    value={propEditor.state[pr]}
                    onChange={this._handleSizeChange}
                    propEditor={propEditor}
                    property={pr}
                    options={visibilityOptions}/>
            );
        }
        return (
            <div className="lm-size-properties">
                <h4>Responsive</h4>
                <div>Visible on:</div>
                {props}
            </div>
        );
    },

    getVisibilityOptions: function() {
        var result = [];

        result.push(
            <option value="" key={0}>inherit</option>
        );
        result.push(
            <option value="visible" key={1}>visible</option>
        );
        result.push(
            <option value="hidden" key={2}>hidden</option>
        );

        return result;
    },

};

module.exports = LayoutManagerBootstrap;
