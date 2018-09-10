import { ProtoTable } from './ProtoTable';
import { DYNAMIC_SIZE_TYPE, staticTypes } from './types';

export type FieldName = string;
export type FieldType = string;
export type TypedFieldsMap = Map<FieldName, FieldType>;

/**
 * Dynamic Types
 * - should be prefixed with UInt32BE describing the memory space requirements.
 * Example of dynamic types: String, BSON.
 */
const getDynamicSizeField = (fieldName: string) => `${fieldName}_SIZE`;

const validate = (typedFields: TypedFieldsMap) => {
    if (typedFields === null || typeof typedFields === 'undefined') {
        throw new Error('Typed fields cannot be null or undefined.');
    }

    if(!(typedFields instanceof Map)) {
        throw new TypeError('The typed fields should be an instance of Map<string, string>');
    }

    if(typedFields.size === 0) {
        throw new RangeError('No typed fields found. Please use decorators @proto, @uint8, @string, @object, etc.');
    }
};

/**
 * Returns ProtoTable describing types of given fields.
 * @param { TypedFieldsMap } typedFields - mapping between feilds and their types.
 */
export function build(typedFields: TypedFieldsMap): ProtoTable {
    validate(typedFields);

    const protoTable: ProtoTable = [];
    for (let [field, type] of typedFields.entries()) {
        if (staticTypes.has(type)) protoTable.push([field, type]);
        else {
            const dsField = getDynamicSizeField(field);

            /** Example:
             * [ 'requestId_SIZE', 'UInt32BE' ], 
             * [ 'requestId',      'requestId_SIZE',   'String' ],
             */
            protoTable.push([dsField,   DYNAMIC_SIZE_TYPE]);
            protoTable.push([field,     dsField,            type]);
        }
    }
    return protoTable;
}
