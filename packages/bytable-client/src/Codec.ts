import { DataViewReader } from './DataViewReader';
import { DataViewWriter } from './DataViewWriter';

/**
 * Responsible for reading binary data and constructing js objects.
 * 
 * `Codec.create(C)` is more preferable to use over `new Codec(C)`.
 * It will create a new instance or pull one from cache.
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

    // Cache of codec instances by class type.
    private static types: WeakMap<any, any> = new WeakMap();

    /**
     * Creates a new instance of the Codec or pulls from cache.
     * @param C - class type.
     */
    public static create<K>(C: { new(): K }) {
        if(!this.types.has(C)) {
            this.types.set(C, new Codec(C));
        }
        return this.types.get(C);
    }
}
