import { Reader, byteMap } from 'bytable';
import { BSON } from 'bson';
import { Buffer } from 'buffer';

const bson = new BSON();

export class DataViewReader<C> extends Reader<C, DataView> {
    readAs<T>(msg: DataView, type: string, offset: number, size: number): T {
        if(byteMap.has(type)) {
            switch(type){
                case 'UInt8': 
                    return msg.getUint8(offset) as any;
                case 'UInt16BE':
                    return msg.getUint16(offset) as any;
                case 'UInt32BE':
                    return msg.getUint32(offset) as any;

                case 'Int8': 
                    return msg.getInt8(offset) as any;
                case 'Int16BE':
                    return msg.getInt16(offset) as any;
                case 'Int32BE':
                    return msg.getInt32(offset) as any;

                case 'FloatBE': 
                    return msg.getFloat32(offset) as any;
                case 'DoubleBE':
                    return msg.getFloat64(offset) as any;
            }
        }
        const buf = msg.buffer.slice(offset, offset + size);
        if(type === 'BSON') {
            return bson.deserialize(Buffer.from(buf));
        }
        return Buffer.from(buf).toString('UTF8') as any;
    }
}
