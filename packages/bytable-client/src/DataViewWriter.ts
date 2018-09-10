import { Writer } from 'bytable';
import { BSON } from 'bson';
import { Buffer } from 'buffer';

const bson = new BSON();

// TODO: Should not rely on Buffer!!!
export class DataViewWriter<T> extends Writer<T, ArrayBuffer> {
    protected alloc(size: number): ArrayBuffer {
        return Buffer.from(new ArrayBuffer(size)) as any;
    }

    protected dynamicToBinary(type: string, value: any): any {
        if(type === 'BSON') {
            return bson.serialize(Buffer.from(value));
        }
        if(type === 'String') {
            return Buffer.from(value as string, 'UTF8');
        }
        return null;
    }
    protected writeAs(m: ArrayBuffer, type: string, value: any, shift: number): any {
        if(type === 'binary') (m as any).fill(value as Buffer, shift);
        else                  (m as any)[`write${type}`](value, shift);
    }
}
