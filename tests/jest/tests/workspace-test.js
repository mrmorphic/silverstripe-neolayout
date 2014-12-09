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

        // Set the document HTML. The input where workspace data is written.
        document.body.innerHTML = '<input id="Form_EditForm_EditableLayout" type="text" />';
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

        // Test the initial value
        expect(JSON.stringify(workspace._getFieldById(componentId).bindings)).toEqual(initialValue);

        // Update the component's binding
        workspace._updateFieldData(componentId, { "Text": { "type": "embedded", "value": "Hello sailor" } });

        // Test the updated value
        expect(JSON.stringify(workspace._getFieldById(componentId).bindings)).toEqual(expectedResult);
    });

    // _removeFieldFromWorkspace()
    it('should remove a component from the workspace', function () {
        var topLevelFieldId = 'bbeb59f5-8e0e-46c8-b85d-6e412ec4a984',
            nestedFieldId = '295f4265-0030-4df1-aee5-48f9712f86af';

        // Make sure the fields exist to begin with
        expect(workspace._getFieldById(topLevelFieldId)).not.toBeNull();
        expect(workspace._getFieldById(nestedFieldId)).not.toBeNull();

        // Remove the top level field
        workspace._removeFieldFromWorkspace(topLevelFieldId);
        expect(workspace._getFieldById(topLevelFieldId)).toBeNull();

        // Remove the nested field
        workspace._removeFieldFromWorkspace(nestedFieldId);
        expect(workspace._getFieldById(nestedFieldId)).toBeNull();
    });

    // _moveWorkspaceField()
    it('should move a component to a new parent component', function () {
        var fieldId = '295f4265-0030-4df1-aee5-48f9712f86af', // The field we're moving
            oldParentId = 'eb3e4923-6854-4fa5-a642-35d033b14bc5', // The parent we're moving from
            newParentId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede'; // The parent we're moving to

        // Check the field we're moving is where it's supposed to be
        expect(workspace._getFieldById(oldParentId).children[0].id).toEqual(fieldId);

        // Move the nested link component to the top level
        workspace._moveWorkspaceField(fieldId, newParentId);

        // Check the field has been removed from it's onld parent
        expect(workspace._getFieldById(oldParentId).children.length).toEqual(0);

        // Check the field is at it's new location
        expect(workspace._getFieldById(newParentId).children[2].id).toEqual(fieldId);
    });

    // _addWorkspaceField()
    it('should add a new component to the workspace', function () {
        var topLevelId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede',
            fieldType = 'NLImageComponent',
            newFieldId;

        // Add a new field to the top level
        newFieldId = workspace._addWorkspaceField(topLevelId, fieldType);

        // Check the new field was created
        expect(workspace._getFieldById(topLevelId).children[2].id).toEqual(newFieldId);
    });

    // _fieldIsRoot()
    it('should tell me if i\'m dealing with the root element on the workspace', function () {
        var rootId = '57c96596-f4fd-4f29-a7da-ce43c02d8ede',
            childId = 'eb3e4923-6854-4fa5-a642-35d033b14bc5',
            grandChildId = '295f4265-0030-4df1-aee5-48f9712f86af';

        expect(workspace._fieldIsRoot(rootId)).toEqual(true);
        expect(workspace._fieldIsRoot(childId)).toEqual(false);
        expect(workspace._fieldIsRoot(grandChildId)).toEqual(false);
    });

    // _allocateIds()
    it('should allocate a version 4 uuid to fields with no id', function () {
        var fieldWithId = {
                "ClassName":"NLImageComponent",
                "bindings":{},
                "id":"bbeb59f5-8e0e-46c8-b85d-6e412ec4a984",
                "children":[]
            },
            fieldWithoutId = {
                "ClassName":"NLImageComponent",
                "bindings":{},
                "children":[]
            };

        // The field's id should not be altered if an id already exists
        expect(workspace._allocateIds(fieldWithId).id).toEqual('bbeb59f5-8e0e-46c8-b85d-6e412ec4a984');

        // A valid version 4 uuid should be allocated to a field without an id
        expect(workspace._allocateIds(fieldWithoutId).id.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)).not.toBeNull();
    });
});
