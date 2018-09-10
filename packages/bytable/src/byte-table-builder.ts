import { ProtoTable, ByteShiftProtoTable } from './ProtoTable';
import { byteMap, BINARY } from './types';

const SIZE_UNKNOWN = -1;

type NumberReader<T> = (m: T, type: string, start: number, size: number) => number;

/**
 * Computes byte shift protocol table for static and dynamic types.
 * For dynamic types it reads size from a supplementary UInt32BE field.
 * @param { BinaryMessage } msg0 - binary message.
 * @param { ProtoTable } protoTable - protocol table.
 * @param { NumberReader } readAsNumber - binary reader.
 */
export function fromBinary<BinaryMessage>(
    msg0: BinaryMessage,
    protoTable: ProtoTable,
    readAsNumber: NumberReader<BinaryMessage>,
): ByteShiftProtoTable {
    let shift: number = 0;
    let size_before:  number = 0;
    let byteShift: ByteShiftProtoTable = [];
    for (let [index, [name, type, origin]] of protoTable.entries()) {
        const isStatic = byteMap.has(type);
        let size: number = isStatic ? byteMap.get(type): SIZE_UNKNOWN;
        /**
         * Example of dynamic:
         * [...
         *  [ 'requestId_SIZE', 'UInt32BE' ],
         *  [ 'requestId',      'requestId_SIZE',   'String' ],
         * ...]
         */
        for(let i = index - 1; size === SIZE_UNKNOWN && i >= 0; i--) {
            if(protoTable[i][0] === type) {
                const msg_shift = byteShift[i][3];
                const msg_size  = byteShift[i][2];
                const msg_type  = byteShift[i][1];
                size = readAsNumber(msg0, msg_type, msg_shift, msg_size);
            }
        }
        shift += size_before;
        size_before = size;
        if (origin) byteShift.push([name, origin, size, shift]);
        else        byteShift.push([name, type,   size, shift]);
    }
    return byteShift;
}

/**
 * Computes byte table for JavaScript object.
 * @param { Object } obj - target object to be binarified.
 * @param { ProtoTable } protoTable - protocol table.
 * @param { Function } dynamicToBinary - function to convert and calculate dynamic's binary size.
 */
export function toBinary(
    obj: any,
    protoTable: ProtoTable,
    dynamicToBinary: (type: string, val: any) => { byteLength: number, length: number }
) {
    let n = protoTable.length;
    let table = new Array(n).fill([]);
    // Traverse from the end, because for dynamic types
    // companion fields with size usually occur first.
    while (n --> 0) {
        if(table[n].length !== 0) {
            // Non-empty means that it's been processed.
            continue;
        }

        const [ fieldName, type, dynamic ] = protoTable[n];
        if (dynamic) {
            const binary = dynamicToBinary(dynamic, obj[fieldName]);
            const dynamicSize = type !== 'Binary' ? binary.byteLength: binary.length;
            table[n] = [ BINARY, dynamicSize, binary ];

            // Find companion field and write binary size.
            let j = n; 
            while (j --> 0) {
                if (protoTable[j][0] === type) {
                    table[j] = [
                        // Type
                        protoTable[j][1], 
                        // Size
                        byteMap.get(protoTable[j][1]), 
                        // Value
                        dynamicSize
                    ];
                    j = 0;
                }
            }
        } else {
            table[n] = [ type, byteMap.get(type), obj[fieldName] ];
        }
    }
    return table;
}
