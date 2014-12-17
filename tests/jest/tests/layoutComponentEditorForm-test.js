'use strict';

jest.dontMock('../../../jsx/layoutComponentEditor/editorForm.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    EditorForm = require('../../../jsx/layoutComponentEditor/editorForm.jsx');

describe('EditorForm', function () {
    var editorForm,
        metadata = require('../fixtures/metadata.json'),
        layoutdata = require('../fixtures/layoutdata.json');

    beforeEach(function () {
        editorForm = TestUtils.renderIntoDocument(
            <EditorForm
                layoutdata={layoutdata.children[1]}
                metadata={metadata}
                toggleModalEditor={jest.genMockFunction()}
                updateLayoutComponentData={jest.genMockFunction()}
                getLayoutComponentSchema={function () { return metadata.components[2]; }} />
        );
    });

    // _createFormRows
    it('should create a row for each binding type relating to the component', function () {
        var rows = editorForm._createFormRows(editorForm.props.getLayoutComponentSchema(), editorForm.props.metadata.context);

        expect(rows.length).toEqual(1);

        expect(rows[0].type.displayName).toEqual('EditorFormRow')
    });
});
