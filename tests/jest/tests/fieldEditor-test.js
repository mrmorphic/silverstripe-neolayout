'use strict';

jest.dontMock('../../../jsx/fieldEditor.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    FieldEditor = require('../../../jsx/fieldEditor.jsx');

describe('FieldEditor', function () {
    var fieldEditor,
        metadata = require('../fixtures/metadata.json'),
        workspaceData = require('../fixtures/workspacedata.json');

    beforeEach(function () {
        fieldEditor = TestUtils.renderIntoDocument(
            <FieldEditor
                data={workspaceData.children[1]}
                metadata={metadata}
                updateFieldData={jest.genMockFunction()}
                removeFieldFromWorkspace={jest.genMockFunction()}
                canEdit={jest.genMockFunction()}
                canRemove={jest.genMockFunction()} />
        );
    });

    // _toggleModalEditor
    it('should toggle the visible state of the editor', function () {
        // The 'editing' state should be false by default
        expect(fieldEditor.state.editing).toEqual(false);

        fieldEditor._toggleModalEditor();

        expect(fieldEditor.state.editing).toEqual(true);

        fieldEditor._toggleModalEditor();

        expect(fieldEditor.state.editing).toEqual(false);
    });
});
