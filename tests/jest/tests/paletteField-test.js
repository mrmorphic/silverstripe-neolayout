'use strict';

jest.dontMock('../../../jsx/paletteField.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    PaletteField = require('../../../jsx/paletteField.jsx');

describe('PaletteField', function () {
    var metadata = require('../fixtures/text_metadata.json');

    it('should display values from metadata', function () {
        var paletteField = TestUtils.renderIntoDocument(
            <PaletteField data={metadata} />
        );

        var name = TestUtils.findRenderedDOMComponentWithClass(paletteField, 'name');
        expect(name.getDOMNode().textContent).toEqual(metadata.name);

        var description = TestUtils.findRenderedDOMComponentWithClass(paletteField, 'description');
        expect(description.getDOMNode().textContent).toEqual(metadata.description);
    });
});
