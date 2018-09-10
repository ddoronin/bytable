import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from '../src';
import { $$getShiftTable } from '../src/proto';

interface IPayload {
    readonly collection: string;
    readonly find?: {};
    readonly projection?: {};
}

describe('decorators-to-proto-table', () => {
    @proto
    class Req {
        @string
        requestId: string;

        @uint8
        readonly index: number;

        @uint16
        readonly count: number;

        @bson
        payload: IPayload;
    }

    it('should create ', () => {
        const req = new Req();
        req.payload = {collection: 'Hello', find: 'World!'};
        const shiftTable = (req as any)[$$getShiftTable]();
        expect(shiftTable).to.deep.eq([ 
            [ 'requestId_SIZE', 'UInt32BE' ],
            [ 'requestId',      'requestId_SIZE',   'String' ],
            [ 'index',          'UInt8' ],
            [ 'count',          'UInt16BE' ],
            [ 'payload_SIZE',   'UInt32BE' ],
            [ 'payload',        'payload_SIZE',     'BSON' ]
        ]);
    });
});
