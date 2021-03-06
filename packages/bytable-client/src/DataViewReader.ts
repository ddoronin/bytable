import { Reader, byteMap } from 'bytable';
import { Buffer } from 'buffer';
import { bson } from './core';

export class DataViewReader<C> extends Reader<C, DataView> {
    readAs<T>(msg: DataView, type: string, offset: number, size: number): T {
        // Static Types
        switch(type) {
            case 'UInt8':       return msg.getUint8(offset) as any;
            case 'UInt16BE':    return msg.getUint16(offset) as any;
            case 'UInt32BE':    return msg.getUint32(offset) as any;
            case 'Int8':        return msg.getInt8(offset) as any;
            case 'Int16BE':     return msg.getInt16(offset) as any;
            case 'Int32BE':     return msg.getInt32(offset) as any;
            case 'FloatBE':     return msg.getFloat32(offset) as any;
            case 'DoubleBE':    return msg.getFloat64(offset) as any;
        }

        // Dynamic Types
        const buf: Buffer = Buffer.from(msg.buffer, offset, size);
        switch(type) {
            case 'BSON':        return bson.deserialize(buf);
            case 'Binary':      return buf.buffer.slice(offset, offset + size) as any;
            case 'String':      return buf.toString('UTF8') as any;
        }

        // Everything else
        throw new Error(`Unknown type ${type}`);
    }
}
