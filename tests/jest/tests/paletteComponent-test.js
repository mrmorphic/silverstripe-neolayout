'use strict';

jest.dontMock('../../../jsx/component/paletteComponent.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    PaletteComponent = require('../../../jsx/component/paletteComponent.jsx');

describe('PaletteComponent', function () {
    var metadata = require('../fixtures/metadata.json');

    it('should display values from metadata', function () {
        var paletteComponent = TestUtils.renderIntoDocument(
            <PaletteComponent layoutdata={metadata.components[0]} />
        );

        var name = TestUtils.findRenderedDOMComponentWithClass(paletteComponent, 'name');
        expect(name.getDOMNode().textContent).toEqual(metadata.components[0].name);

        var description = TestUtils.findRenderedDOMComponentWithClass(paletteComponent, 'description');
        expect(description.getDOMNode().textContent).toEqual(metadata.components[0].description);
    });
});
