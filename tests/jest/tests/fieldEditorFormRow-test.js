'use strict';

jest.dontMock('../../../jsx/fieldEditorFormRow.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    FieldEditorFormRow = require('../../../jsx/fieldEditorFormRow.jsx');

describe('FieldEditorFormRow', function () {
    var fieldEditorFormRow,
        metadata = require('../fixtures/metadata.json'),
        workspaceData = require('../fixtures/workspacedata.json'),
        schemaData = {
            name: metadata.components[2].properties.Text.name,
            types: metadata.components[2].properties.Text.type,
            key: 2
        };

    beforeEach(function () {
        fieldEditorFormRow = TestUtils.renderIntoDocument(
            <FieldEditorFormRow
                binding={workspaceData.children[1].bindings}
                schema={schemaData}
                contextMetadata={metadata.context} />
        );
    });

    // _getContextOptions
    it('should get the context options', function () {
        var options = fieldEditorFormRow._getContextOptions();

        expect(options.length).toEqual(3);
    });
});
