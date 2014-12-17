'use strict';

jest.dontMock('../../../jsx/layoutComponentEditor/editorFormRow.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    EditorFormRow = require('../../../jsx/layoutComponentEditor/editorFormRow.jsx');

describe('EditorFormRow', function () {
    var editorFormRow,
        metadata = require('../fixtures/metadata.json'),
        layoutdata = require('../fixtures/layoutdata.json'),
        schemaData = {
            name: metadata.components[2].properties.Text.name,
            types: metadata.components[2].properties.Text.type,
            key: 2
        };

    beforeEach(function () {
        editorFormRow = TestUtils.renderIntoDocument(
            <EditorFormRow
                binding={layoutdata.children[1].bindings}
                schema={schemaData}
                contextMetadata={metadata.context} />
        );
    });

    // _getContextOptions
    it('should get the context options', function () {
        var options = editorFormRow._getContextOptions();

        expect(options.length).toEqual(3);
    });
});
