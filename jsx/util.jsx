'use strict';

module.exports = {
    getFieldSchema: function (componentType, schemas) {
        var i = 0;

        // Don't compare undefined to schema[i].componentType.
        // If schema[i].componentType is undefined, it will match.
        if (typeof componentType !== 'string') {
            throw new Error('componentType should be a string, you passed typeof ' + typeof componentType);
        }

        for (i; i < schemas.length; i += 1) {
            if (schemas[i].componentType === componentType) {
                return schemas[i];
            }
        }
    }
};
