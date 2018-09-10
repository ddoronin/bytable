import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from '../src';
import { Reader } from '../src/Reader';
import { Writer } from '../src/Writer';
import { byteMap } from '../src/types';

describe('Reade and Write for nodejs', () => {
    class BufferReader<T> extends Reader<T, Buffer> {
        readAs<TT>(msg: Buffer, type: string, start: number, size: number): TT {
            if(byteMap.has(type)) {
                return (msg as any).slice(start, start + size)[`read${type}`]() as any;
            }
            return msg.slice(start, start + size).toString() as any;
        }
    }

    class BufferWriter<T> extends Writer<T, Buffer> {
        protected alloc(size: number): Buffer {
            return Buffer.allocUnsafe(size);
        }

        protected dynamicToBinary(type: string, value: any): any {
            if(type === 'String'){
                return Buffer.from(value as string, 'UTF8');
            }
            return null;
        }
        protected writeAs(m: Buffer, type: string, value: any, shift: number): any {
            if(type === 'binary') {
                m.fill(value as Buffer, shift);
            } else (m as any)[`write${type}`](value, shift);
        }
    }

    @proto
    class TestMessage {
        @string
        str: string;

        @uint8
        index: number;

        @uint16
        count: number;
    }

    const reader = new BufferReader(TestMessage);
    const writer = new BufferWriter(TestMessage);

    it('should create a binary message and parse it back', () => {
        const message = new TestMessage();
        message.str = 'Hello, World!';
        message.index = 42;
        message.count = 777;
        const buf = writer.write(message);
        const actualMessage: TestMessage = reader.read(buf);
        expect(actualMessage).to.deep.eq(message);
    });
});