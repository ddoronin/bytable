import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string, u16 } from '../src';
import { Reader } from '../src/Reader';
import { byteMap } from '../src/types'

describe('Reader', () => {
    class BufferReader<T> extends Reader<T, Buffer> {
        readAs<TT>(msg: Buffer, type: string, start: number, size: number): TT {
            if(byteMap.has(type)) {
                return (msg as any).slice(start, start + size)[`read${type}`]() as any;
            }
            return (msg as any).slice(start, start + size).toString() as any;
        }
    }

    @proto
    class TestMessage {
        @string
        readonly str: string;

        @uint8
        readonly index: number;

        @uint16
        readonly count: number;
    }

    const reader = new BufferReader(TestMessage);

    it('should parse test message', () => {
        const b = Buffer.allocUnsafe(100);
        let s = Buffer.from('Hello, World!');
        b.writeUInt32BE(s.byteLength, 0);
        b.fill(s, 4);
        b.writeUInt8(42, s.byteLength + 4);
        b.writeUInt16BE(777, 1 + s.byteLength + 4);
        const m = reader.read(b);
        expect(m.str).to.eq('Hello, World!');
        expect(m.index).to.eq(42);
        expect(m.count).to.eq(777);
    });

});
