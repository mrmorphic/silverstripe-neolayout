'use strict';

jest.dontMock('../../../jsx/fieldEditorForm.jsx');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    FieldEditorForm = require('../../../jsx/fieldEditorForm.jsx');

describe('FieldEditorForm', function () {
    var fieldEditorForm,
        metadata = require('../fixtures/metadata.json'),
        workspaceData = require('../fixtures/workspacedata.json');

    beforeEach(function () {
        fieldEditorForm = TestUtils.renderIntoDocument(
            <FieldEditorForm
                data={workspaceData.children[1]}
                metadata={metadata}
                toggleModalEditor={jest.genMockFunction()}
                updateFieldData={jest.genMockFunction()} />
        );
    });

    // _getFieldSchema
    it('should get the schema relating to the current field', function () {
        var fieldSchema = metadata.components[2],
            result = fieldEditorForm._getFieldSchema(fieldEditorForm.props.data.ClassName, fieldEditorForm.props.metadata.components);

        expect(JSON.stringify(result)).toEqual(JSON.stringify(fieldSchema));
    });

    // _createFormRows
    it('should create a row for each binding type relating to the component', function () {
        var schema = fieldEditorForm._getFieldSchema(fieldEditorForm.props.data.ClassName, fieldEditorForm.props.metadata.components),
            rows = fieldEditorForm._createFormRows(schema, fieldEditorForm.props.metadata.context);

        expect(rows.length).toEqual(1);

        expect(rows[0].type.displayName).toEqual('FieldEditorFormRow')
    });
});
