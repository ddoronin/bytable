import { expect } from 'chai';
import { build } from '../src/proto-table-builder';

describe('proto-table-builder', () => {
    // TODO: cover validations!
    it('should throw an error when no typed fields', () => {
        expect(() => build(null)).to.throw('Typed fields cannot be null or undefined.');
        expect(() => build(undefined)).to.throw('Typed fields cannot be null or undefined.');
    });

    it('should throw an error when typed fields are not a Map<K, V>', () => {
        expect(() => build({} as any)).to.throw('The typed fields should be an instance of Map<string, string>');
    });

    it('should throw an error when typed fields are an empty Map<K, V>', () => {
        expect(() => build(new Map())).to.throw('No typed fields found. Please use decorators @proto, @uint8, @string, @object, etc.');
    });

    it('should handle static types', () => {
        const typedFields = new Map([
            ['a', 'UInt8'],
            ['b', 'UInt16BE'],
            ['c', 'UInt32BE'],
        ]);
        expect(build(typedFields)).to.deep.eq([
            ['a', 'UInt8'],
            ['b', 'UInt16BE'],
            ['c', 'UInt32BE'],
        ])
    });

    it('should handle dynamic types', () => {
        const typedFields = new Map([
            ['request_id', 'String']
        ]);
        expect(build(typedFields)).to.deep.eq([ 
            [ 'request_id_SIZE',    'UInt32BE' ],
            [ 'request_id',         'request_id_SIZE',  'String' ] 
        ]);
    });

    it('should handle a mix of static and dynamic types', () => {
        const typedFields = new Map([
            ['a', 'UInt8'],
            ['b', 'String'],
        ]);
        expect(build(typedFields)).to.deep.eq([ 
            [ 'a',      'UInt8' ],
            [ 'b_SIZE', 'UInt32BE' ],
            [ 'b',      'b_SIZE',  'String' ] 
        ]);
    });

    it('should handle a mix of static/dynamic/static types', () => {
        const typedFields = new Map([
            ['a', 'UInt8'],
            ['b', 'String'],
            ['c', 'BSON'],
            ['d', 'Int16BE'],
        ]);
        expect(build(typedFields)).to.deep.eq([ 
            [ 'a',      'UInt8' ],
            [ 'b_SIZE', 'UInt32BE' ],
            [ 'b',      'b_SIZE',  'String' ],
            [ 'c_SIZE', 'UInt32BE' ],
            [ 'c',      'c_SIZE',  'BSON' ],
            [ 'd',      'Int16BE' ],
        ]);
    });
});
