import { Writer } from 'bytable';
import { Buffer } from 'buffer';
import { bson } from './core';

export class DataViewWriter<T> extends Writer<T, DataView> {
    protected alloc(size: number): DataView {
        return new DataView(new ArrayBuffer(size));
    }

    protected dynamicToBinary(type: string, value: any): any {
        if(type === 'BSON')     return bson.serialize(value);
        if(type === 'String')   return Buffer.from(value as string, 'UTF8');
        return null;
    }

    protected writeAs(msg: DataView, type: string, value: any, offset: number): any {
        switch(type){
            case 'UInt8':       return msg.setUint8(offset, value) as any;
            case 'UInt16BE':    return msg.setUint16(offset, value) as any;
            case 'UInt32BE':    return msg.setUint32(offset, value) as any;
            case 'Int8':        return msg.setInt8(offset, value) as any;
            case 'Int16BE':     return msg.setInt16(offset, value) as any;
            case 'Int32BE':     return msg.setInt32(offset, value) as any;
            case 'FloatBE':     return msg.setFloat32(offset, value) as any;
            case 'DoubleBE':    return msg.setFloat64(offset, value) as any;
        }
        if(type === 'binary')   return Buffer.from(msg.buffer as any).fill(value, offset).buffer;
        else                    throw new Error(`Unknown type ${type}.`);
    }
}
