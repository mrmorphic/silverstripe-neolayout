'use strict';

jest.dontMock('../../../jsx/component/layout.jsx');
jest.dontMock('../../../jsx/mixin/componentUtils.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    Layout = require('../../../jsx/component/layout.jsx');

describe('Layout', function () {
    var layout,
        metadata = require('../fixtures/metadata.json'),
        layoutdata = require('../fixtures/layoutdata.json');

    beforeEach(function () {
        var input;

        // Set the document HTML. The input where layout data is written.
        document.body.innerHTML = '<input id="Form_EditForm_EditableLayout" type="text" />';
        input = document.getElementById('Form_EditForm_EditableLayout');
        input.value = JSON.stringify(layoutdata);

        layout = TestUtils.renderIntoDocument(
            <Layout metadata={metadata} />
        );
    });

    // _getLayoutComponentById()
    it('should get LayoutComponent data by LayoutComponent id', function () {
        var layoutComponentData = layout._getLayoutComponentById("bbeb59f5-8e0e-46c8-b85d-6e412ec4a984");

        expect(JSON.stringify(layoutComponentData)).toEqual(JSON.stringify({"ClassName":"NLImageComponent","bindings":{},"id":"bbeb59f5-8e0e-46c8-b85d-6e412ec4a984","children":[]}));
    });

    // _updateLayoutComponentData()
    it('should update the state when a LayoutComponent binding changes', function () {
        var componentId = "eb3e4923-6854-4fa5-a642-35d033b14bc5",
            initialValue = JSON.stringify({"Text":{"type":"embedded","value":"Hello world"}});
            expectedResult = JSON.stringify({"Text":{"type":"embedded","value":"Hello sailor"}});

        // Test the initial value
        expect(JSON.stringify(layout._getLayoutComponentById(componentId).bindings)).toEqual(initialValue);

        // Update the component's binding
        layout._updateLayoutComponentData(componentId, { "Text": { "type": "embedded", "value": "Hello sailor" } });

        // Test the updated value
        expect(JSON.stringify(layout._getLayoutComponentById(componentId).bindings)).toEqual(expectedResult);
    });

    // _removeLayoutComponentFromLayout()
    it('should remove a LayoutComponent from the Layout', function () {
        var topLevelLayoutComponentId = 'bbeb59f5-8e0e-46c8-b85d-6e412ec4a984',
            nestedLayoutComponentId = '295f4265-0030-4df1-aee5-48f9712f86af';

        // Make sure the LayoutComponents exist to begin with
        expect(layout._getLayoutComponentById(topLevelLayoutComponentId)).not.toBeNull();
        expect(layout._getLayoutComponentById(nestedLayoutComponentId)).not.toBeNull();

        // Remove the top level field
        layout._removeLayoutComponentFromLayout(topLevelLayoutComponentId);
        expect(layout._getLayoutComponentById(topLevelLayoutComponentId)).toBeNull();

        // Remove the nested field
        layout._removeLayoutComponentFromLayout(nestedLayoutComponentId);
        expect(layout._getLayoutComponentById(nestedLayoutComponentId)).toBeNull();
    });

    // _moveLayoutComponent()
    it('should move a LayoutComponent to a new parent', function () {
        var layoutComponentId = '295f4265-0030-4df1-aee5-48f9712f86af', // The field we're moving
            oldParentId = 'eb3e4923-6854-4fa5-a642-35d033b14bc5', // The parent we're moving from
            newParentId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede'; // The parent we're moving to

        // Check the LayoutComponent we're moving is where it's supposed to be
        expect(layout._getLayoutComponentById(oldParentId).children[0].id).toEqual(layoutComponentId);

        // Move the nested link LayoutComponent to the top level
        layout._moveLayoutComponent(layoutComponentId, newParentId);

        // Check the LayoutComponent has been removed from its old parent
        expect(layout._getLayoutComponentById(oldParentId).children.length).toEqual(0);

        // Check the LayoutComponent is at its new location
        expect(layout._getLayoutComponentById(newParentId).children[2].id).toEqual(layoutComponentId);
    });

    // _addLayoutComponent()
    it('should add a new LayoutComponent to the Layout', function () {
        var topLevelId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede',
            layoutComponentType = 'NLImageComponent',
            newLayoutComponentId;

        // Add a new LayoutComponent to the top level
        newLayoutComponentId = layout._addLayoutComponent(topLevelId, layoutComponentType);

        // Check the new field was created
        expect(layout._getLayoutComponentById(topLevelId).children[2].id).toEqual(newLayoutComponentId);
    });

    // _layoutComponentIsRoot()
    it('should tell me if i\'m dealing with the root LayoutComponent on the Layout', function () {
        var rootId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede',
            childId = 'eb3e4923-6854-4fa5-a642-35d033b14bc5',
            grandChildId = '295f4265-0030-4df1-aee5-48f9712f86af';

        expect(layout._layoutComponentIsRoot(rootId)).toEqual(true);
        expect(layout._layoutComponentIsRoot(childId)).toEqual(false);
        expect(layout._layoutComponentIsRoot(grandChildId)).toEqual(false);
    });
});
