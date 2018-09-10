import { BufferReader } from './BufferReader';
import { BufferWriter } from './BufferWriter';

export class Codec<T> { 
    private readonly reader: BufferReader<T>;
    private readonly writer: BufferWriter<T>;

    constructor(private C: { new(): T }) {
        this.reader = new BufferReader(C);
        this.writer = new BufferWriter(C);
    }

    read(msg: Buffer): T {
        return this.reader.read(msg);
    }

    write(obj: T): Buffer {
        return this.writer.write(obj);
    }
}
