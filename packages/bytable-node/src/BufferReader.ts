import { Reader, byteMap } from 'bytable';
import { bson } from './core';

export class BufferReader<C> extends Reader<C, Buffer> {
    readAs<T>(msg: Buffer, type: string, offset: number, size: number): T {
        switch(type){
            case 'UInt8':       return msg.readUInt8(offset) as any;
            case 'UInt16BE':    return msg.readUInt16BE(offset) as any;
            case 'UInt32BE':    return msg.readUInt32BE(offset) as any;
            case 'Int8':        return msg.readInt8(offset) as any;
            case 'Int16BE':     return msg.readInt16BE(offset) as any;
            case 'Int32BE':     return msg.readInt32BE(offset) as any;
            case 'FloatBE':     return msg.readFloatBE(offset) as any;
            case 'DoubleBE':    return msg.readDoubleBE(offset) as any;
            case 'BSON':        return bson.deserialize(
                                    msg.slice(offset, offset + size)
                                ) as any;
            default:            return msg.slice(offset, offset + size).toString('UTF8') as any;
        }
    }
}
