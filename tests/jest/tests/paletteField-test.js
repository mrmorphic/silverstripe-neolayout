'use strict';

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    PaletteField = require('../../../jsx/paletteField.jsx');

jest.dontMock('../../../jsx/paletteField.jsx');

describe('PaletteField', function () {
    var field = {
        name: "test",
        description: "this is a test"
    };

    it('does stuff', function () {
        // Render a PaletteField in the document
        var paletteField = TestUtils.renderIntoDocument(
            <PaletteField data={field} />
        );
    });
});
