import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from '../src';
import { Writer } from '../src/Writer';

describe('Writer for nodejs', () => {
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

    const writer = new BufferWriter(TestMessage);

    it('should convert the class instance into binary', () => {
        const message = new TestMessage();
        message.str = 'Hello, World!';
        message.index = 42;
        message.count = 777;

        const buf = writer.write(message);
        const str_size = buf.readInt32BE(0);
        const str = buf.slice(4, 4 + str_size).toString();
        expect(str).to.eq('Hello, World!');
    });
});