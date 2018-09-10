import { expect } from 'chai';
import { ProtoTable } from '../src/ProtoTable';
import { fromBinary, toBinary } from '../src/byte-table-builder';
import { BINARY } from '../src/types';

describe('byte-table-builder', () => {
    const str = (s: string): Buffer => Buffer.from(s);
    const u8_size = 1;
    const u16_size = 2;
    const u32_size = 4;

    const readAs = (m: any, type: string, start: number, size: number) => 
        (m as any).slice(start, start + size)[`read${type}`](0);

    describe('fromBinary', () => {
        it('should handle statics', () => {
            // binary message
            const msg = Buffer.allocUnsafe(u8_size + u16_size + u32_size);
            msg.writeUInt8(11, 0);
            msg.writeUInt16BE(222, u8_size);
            msg.writeUInt32BE(3333, u16_size);

            // protocol
            const protoTable: ProtoTable = [
                ['a',    'UInt8'],
                ['b',    'UInt16BE'],
                ['c',    'UInt32BE']
            ];

            // bynary shift table
            const bst = fromBinary(
                msg, 
                protoTable, 
                readAs
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['a',        'UInt8',       u8_size,     0],
                ['b',        'UInt16BE',    u16_size,    u8_size],
                ['c',        'UInt32BE',    u32_size,    u8_size + u16_size]
            ]);
        });

        it('should handle dynamics', () => {
            const s = str('Hello, World!');
            const s_size = s.byteLength;
            const u32_size = 4;

            // binary message
            const msg = Buffer.allocUnsafe(u32_size + s_size);
            msg.writeUInt32BE(s_size, 0);
            msg.fill(s, u32_size);

            // protocol
            const protoTable: ProtoTable = [
                ['size',    'UInt32BE'],
                ['str',     'size',     'String']
            ];

            // bynary shift table
            const bst = fromBinary(
                msg, 
                protoTable, 
                (m, type, start, size) => (m as any).slice(start, start + size)[`read${type}`](0)
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['size',     'UInt32BE',    u32_size,    0],
                ['str',      'String',      s_size,      u32_size]
            ]);
        });

        it('should handle statics and dynamics', () => {
            const s1 = str('Hello');
            const s1_size = s1.byteLength;

            const s2 = str('Binary JavaScript');
            const s2_size = s2.byteLength;

            const n16 = 42;
            //msg.writeUInt16BE(222, u8_size);
            // binary message
            const msg = Buffer.allocUnsafe(
                u32_size + s1_size + 
                u16_size + 
                u32_size + s2_size);

            msg.writeUInt32BE(s1_size, 0);
            msg.writeUInt32BE(s2_size, u32_size);
            msg.writeUInt16BE(n16, u32_size + u32_size);
            msg.fill(s1, u32_size + u32_size + u16_size);
            msg.fill(s2, u32_size + u32_size + u16_size + s1_size);

            // protocol
            const protoTable: ProtoTable = [
                ['size1',   'UInt32BE'],
                ['size2',   'UInt32BE'],
                ['num',     'UInt16BE'],
                ['str1',    'size1',     'String'],
                ['str2',    'size2',     'String']
            ];

            // bynary shift table
            const bst = fromBinary(
                msg, 
                protoTable, 
                readAs
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['size1',    'UInt32BE',    u32_size,    0],
                ['size2',    'UInt32BE',    u32_size,    u32_size],
                ['num',      'UInt16BE',    u16_size,    u32_size + u32_size],
                ['str1',     'String',      s1_size,     u32_size + u32_size + u16_size],
                ['str2',     'String',      s2_size,     u32_size + u32_size + u16_size + s1_size]
            ]);
        });
    });

    describe('toBinary', () => {
        const dynamicToBinary = (type: string, value: any) => {
            if(type === 'String'){
                return Buffer.from(value as string, 'UTF8');
            }
            return null;
        }

        it('should handle static types', () => {
            const obj = {
                a: 1,
                b: 22,
                c: 333
            };

            // protocol
            const protoTable: ProtoTable = [
                ['a',    'UInt8'],
                ['b',    'UInt16BE'],
                ['c',    'UInt32BE']
            ];

            const byteTable = toBinary(
                obj,
                protoTable,
                dynamicToBinary
            )
            expect(byteTable).to.deep.eq([
            /**
             *  +------------+-------------+------------+
             *  | Field      | Size        | Val        |
             *  +------------+-------------+------------+ */
                [ 'UInt8',     u8_size,     1],
                [ 'UInt16BE',  u16_size,    22],
                [ 'UInt32BE',  u32_size,    333]
            ]);
        });

        it('should handle dynamic types', () => {
            const obj = {
                s: 'Hello, World!'
            };

            const s_buf = str(obj.s);
            const s_size = s_buf.byteLength;

            // protocol
            const protoTable: ProtoTable = [
                ['s_SIZE', 'UInt32BE'             ],
                ['s',      's_SIZE',    'String'],
            ];

            const byteTable = toBinary(
                obj,
                protoTable,
                dynamicToBinary
            )

            expect(byteTable).to.deep.eq([
            /**
             *  +------------+-------------+------------+
             *  | Field      | Size        | Val        |
             *  +------------+-------------+------------+ */
                [ 'UInt32BE',  u32_size,     s_size ],
                [ BINARY,      s_size,       s_buf],
            ]);
        });

        it('should handle mixed types', () => {
            const obj = {
                a: 42,
                s: 'Hello, World!'
            };

            const s_buf = str(obj.s);
            const s_size = s_buf.byteLength;

            // protocol
            const protoTable: ProtoTable = [
                [ 'a',      'UInt8' ],
                [ 's_SIZE', 'UInt32BE' ],
                [ 's',      's_SIZE',  'String' ],
            ];

            const byteTable = toBinary(
                obj,
                protoTable,
                dynamicToBinary
            )

            expect(byteTable).to.deep.eq([
            /**
             *  +------------+-------------+------------+
             *  | Field      | Size        | Val        |
             *  +------------+-------------+------------+ */
                [ 'UInt8',     u8_size,      42 ],
                [ 'UInt32BE',  u32_size,     s_size ],
                [ BINARY,      s_size,       s_buf ],
            ]);
        });
    });
});