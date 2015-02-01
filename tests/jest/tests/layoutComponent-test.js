'use strict';

jest.dontMock('../../../jsx/component/layoutComponent.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    LayoutComponent = require('../../../jsx/component/layoutComponent.jsx');

describe('LayoutComponent', function () {
    var layoutComponent,
        metadata = require('../fixtures/metadata.json'),
        layoutdata = require('../fixtures/layoutdata.json');

    beforeEach(function () {
        layoutComponent = TestUtils.renderIntoDocument(
            <LayoutComponent
                layoutdata={layoutdata.children[1]}
                metadata={metadata}
                updateComponent={jest.genMockFunction()}
                removeComponent={jest.genMockFunction()}
                componentIsRoot={jest.genMockFunction()}
                addComponent={jest.genMockFunction()}
                moveComponent={jest.genMockFunction()} />
        );
    });

    // _canEdit
    it('should indicate if the LayoutComponent can be edited', function () {
        // LayoutComponents can always be edited, currently.
        expect(layoutComponent._canEdit()).toEqual(true);
    });

    // _createChildComponents
    it('should create a LayoutComponent for each child of the current LayoutComponent', function () {
        var childComponents = layoutComponent._createChildComponents();

        expect(childComponents.length).toEqual(1);

        expect(childComponents[0].type.displayName).toEqual('LayoutComponent');
    });

    // _getComponentSchema
    it('should get the schema for the LayoutComponent', function () {
        var fieldSchema = metadata.components[2],
            result = layoutComponent._getComponentSchema();

        expect(JSON.stringify(result)).toEqual(JSON.stringify(fieldSchema));
    });
});
