import { Writer } from 'bytable';
import { BSON } from 'bson';

const bson = new BSON();

export class BufferWriter<T> extends Writer<T, Buffer> {
    protected alloc(size: number): Buffer {
        return Buffer.allocUnsafe(size);
    }

    protected dynamicToBinary(type: string, value: any): any {
        if(type === 'Binary' ) {
            return value;
        }
        if(type === 'BSON') {
            return bson.serialize(value);
        }
        if(type === 'String') {
            return Buffer.from(value as string, 'UTF8');
        }
        return null;
    }
    protected writeAs(m: Buffer, type: string, value: any, shift: number): any {
        if(type === 'binary') m.fill(value as Buffer, shift);
        else                  (m as any)[`write${type}`](value, shift);
    }
}
