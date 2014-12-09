'use strict';

jest.dontMock('../../../jsx/workspace.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    Workspace = require('../../../jsx/workspace.jsx');

describe('Workspace', function () {
    var workspace,
        metadata = require('../fixtures/metadata.json'),
        workspaceData = require('../fixtures/workspacedata.json');

    beforeEach(function () {
        workspace = TestUtils.renderIntoDocument(
            <Workspace data={workspaceData} metadata={metadata} />
        );
    });

    // getInitialState()
    it('should have state matching workspace data', function () {
        expect(JSON.stringify(workspace.state.fieldData)).toEqual(JSON.stringify(workspaceData));
    });

    // _getFieldById()
    it('should get component data by component id', function () {
        var fieldData = workspace._getFieldById("bbeb59f5-8e0e-46c8-b85d-6e412ec4a984");

        expect(JSON.stringify(fieldData)).toEqual(JSON.stringify({"ClassName":"NLImageComponent","bindings":{},"id":"bbeb59f5-8e0e-46c8-b85d-6e412ec4a984","children":[]}));
    });

    // _updateFieldData()
    it('should update the state when a component binding changes', function () {
        var componentId = "eb3e4923-6854-4fa5-a642-35d033b14bc5",
            initialValue = JSON.stringify({"Text":{"type":"embedded","value":"Hello world"}});
            expectedResult = JSON.stringify({"Text":{"type":"embedded","value":"Hello sailor"}});

        // Set the document HTML
        document.body.innerHTML = '<div id="Form_EditForm_EditableLayout"></div>';

        // Test the initial value
        expect(JSON.stringify(workspace._getFieldById(componentId).bindings)).toEqual(initialValue);

        // Update the component's binding
        workspace._updateFieldData(componentId, { "Text": { "type": "embedded", "value": "Hello sailor" } });

        // Test the updated value
        expect(JSON.stringify(workspace._getFieldById(componentId).bindings)).toEqual(expectedResult);
    });
});
