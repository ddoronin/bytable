import { DataViewReader } from './DataViewReader';
import { DataViewWriter } from './DataViewWriter';

export class Codec<T> { 
    private readonly reader: DataViewReader<T>;
    private readonly writer: DataViewWriter<T>;

    constructor(private C: { new(): T }) {
        this.reader = new DataViewReader(C);
        this.writer = new DataViewWriter(C);
    }

    read(msg: ArrayBuffer): T {
        return this.reader.read(new DataView(msg)) as any;
    }

    write(obj: T): ArrayBuffer {
        return this.writer.write(obj) as any;
    }
}
