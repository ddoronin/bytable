import { DataViewReader } from './DataViewReader';
import { DataViewWriter } from './DataViewWriter';

/**
 * Codec is responsible for reading data from binary and constructing js objects
 * or writing js objects data into binary format.
 * 
 * Please use `Codec.create(C)` instead of `new Codec(C)` since it's more effecient.
 * It will create a new instance or pull one from the cache if it was alread created before and still available.
 */
export class Codec<T> { 
    private readonly reader: DataViewReader<T>;
    private readonly writer: DataViewWriter<T>;

    constructor(private C: { new(): T }) {
        this.reader = new DataViewReader(C);
        this.writer = new DataViewWriter(C);
    }

    /**
     * Reads data from array buffer into js object.
     * @param buf 
     */
    read(buf: ArrayBuffer): T {
        return this.reader.read(new DataView(buf)) as T;
    }

    /**
     * Writes js object data into array buffer.
     * @param {T} obj - js object.
     */
    write(obj: T): ArrayBuffer {
        return this.writer.write(obj).buffer;
    }

    // Static
    private static types: WeakMap<any, any> = new WeakMap();

    /**
     * Creates a new instance of the Codec or pulls from existed.
     * @param C - class type.
     */
    public static create<K>(C: { new(): K }) {
        if(!this.types.has(C)) {
            this.types.set(C, new Codec(C));
        }
        return this.types.get(C);
    }
}
