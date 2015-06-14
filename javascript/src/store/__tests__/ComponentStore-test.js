jest.dontMock('../ComponentStore.js');
jest.dontMock('object-assign');

describe('ComponentStore', function () {
    var ComponentConstants = require('../../constants/ComponentConstants.js');

    // Mock actoions
    var actionCreate = {
        action: ComponentConstants.COMPONENT_CREATE,
        data: {
            id: '1',
            parent: null,
            ClassName: 'SomeClass'
        }
    };

    var actionDestroy = {
        action: ComponentConstants.COMPONENT_DESTROY,
        data: {
            id: '1'
        }
    };

    var actionUpdate = {
        action: ComponentConstants.COMPONENT_UPDATE,
        data: {
            id: '1',
            key: 'ClassName',
            value: 'OtherClass'
        }
    };

    var AppDispatcher, ComponentStore, callback;

    beforeEach(function () {
        AppDispatcher = require('../../dispatcher/AppDispatcher.js');
        ComponentStore = require('../ComponentStore.js');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function () {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('initialises with no components', function() {
        var components = ComponentStore.getAll();

        expect(components).toEqual({});
    });

    it('creates a component', function () {
        var components, keys;

        callback(actionCreate);

        components = ComponentStore.getAll();
        keys = Object.keys(components);

        expect(keys.length).toBe(1);
        expect(components[keys[0]].ClassName).toEqual('SomeClass');

    });

    it('updates a component', function () {
        var components, keys;

        callback(actionCreate);

        components = ComponentStore.getAll();
        keys = Object.keys(components);

        callback(actionUpdate);

        expect(keys.length).toBe(1);
        expect(components[keys[0]].ClassName).toEqual('OtherClass');
    });

    it('destroys a component', function () {
        var components, keys;

        callback(actionCreate);

        components = ComponentStore.getAll();
        keys = Object.keys(components);

        expect(keys.length).toBe(1);

        callback(actionDestroy);

        expect(components[keys[0]]).toBeUndefined();
    });
});
