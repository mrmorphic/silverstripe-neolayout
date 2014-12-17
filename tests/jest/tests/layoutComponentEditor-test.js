'use strict';

jest.dontMock('../../../jsx/layoutComponentEditor/editor.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    LayoutComponentEditor = require('../../../jsx/layoutComponentEditor/editor.jsx');

describe('LayoutComponentEditor', function () {
    var layoutComponentEditor,
        metadata = require('../fixtures/metadata.json'),
        layoutdata = require('../fixtures/layoutdata.json');

    beforeEach(function () {
        layoutComponentEditor = TestUtils.renderIntoDocument(
            <LayoutComponentEditor
                layoutdata={layoutdata.children[1]}
                metadata={metadata}
                updateLayoutComponentData={jest.genMockFunction()}
                removeLayoutComponentFromLayout={jest.genMockFunction()}
                getLayoutComponentSchema={jest.genMockFunction()}
                canEdit={jest.genMockFunction()}
                canRemove={jest.genMockFunction()} />
        );
    });

    // _toggleModalEditor
    it('should toggle the visible state of the editor', function () {
        // The 'editing' state should be false by default
        expect(layoutComponentEditor.state.editing).toEqual(false);

        layoutComponentEditor._toggleModalEditor();

        expect(layoutComponentEditor.state.editing).toEqual(true);

        layoutComponentEditor._toggleModalEditor();

        expect(layoutComponentEditor.state.editing).toEqual(false);
    });
});
