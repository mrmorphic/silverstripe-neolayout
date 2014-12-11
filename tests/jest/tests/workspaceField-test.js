'use strict';

jest.dontMock('../../../jsx/workspaceField.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    WorkspaceField = require('../../../jsx/workspaceField.jsx');

describe('WorkspaceField', function () {
    var workspaceField,
        metadata = require('../fixtures/metadata.json'),
        workspaceData = require('../fixtures/workspacedata.json');

    beforeEach(function () {
        workspaceField = TestUtils.renderIntoDocument(
            <WorkspaceField
                data={workspaceData.children[1]}
                metadata={metadata}
                updateFieldData={jest.genMockFunction()}
                removeFieldFromWorkspace={jest.genMockFunction()}
                fieldIsRoot={jest.genMockFunction()}
                addWorkspaceField={jest.genMockFunction()}
                moveWorkspaceField={jest.genMockFunction()} />
        );
    });

    // _canEdit
    it('should indicate if the component can be edited', function () {
        // WorkspaceFields can always be edited
        expect(workspaceField._canEdit()).toEqual(true);
    });

    // _createChildFields
    it('should create a WorkspaceField for each child of the current component', function () {
        var childComponents = workspaceField._createChildFields();

        expect(childComponents.length).toEqual(1);

        expect(childComponents[0].type.displayName).toEqual('WorkspaceField');
    });
});
