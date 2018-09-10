import { ProtoTable }               from './ProtoTable';
import { $$types, $$getShiftTable } from './proto';
import { fromBinary }               from './byte-table-builder';

/**
 * Abstract general purpose reader.
 * readAs<T>() should be implemented in concrete classes.
 * The motivation for having it abstract is that browser javascript 
 * is relying on Typed Arrays, but nodejs - on Buffer.
 */
export abstract class Reader<T, M> {
    private readonly instance: T;
    private readonly protocolTable: ProtoTable;

    /**
     * Constructor.
     * @param {T} C - serializable class (should have open constructor).
     */
    constructor(private C: { new(): T }) {
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    /**
     * Returns an instance of type {T} composed from the binary message.
     * @param {M} msg0 - binary message.
     * @returns {T}
     */
    public read(msg0: M): T {
        // Create empty instance of class "C".
        const c = new this.C();

        // Compute byte table from binary message.
        const byteTable = fromBinary(msg0, this.protocolTable, this.readAs as any);
        const typedFields = (c as any)[$$types] as Map<string, string>;

        // Iterate through the byte table and assign parsed values to object properties.
        for (let [_, [field, type, size, shift]] of byteTable.entries()) {
            // Assign only typed fields!
            // Don't assign fields-companions created for dynamics.
            if (typedFields.has(field) && size > 0) {
                (c as any)[field] = this.readAs(msg0 as M, type, shift, size);
            }
        }

        return c;
    };

    /**
     * Reads `size` bytes of the binary message of given `type` starting with position `start`.
     * Should be implemented in child classes.
     * @param {M} msg0 - binary message.
     * @param {string} type - type of data encoded in bytes between start and start + size.
     * @param {number} start - starting position.
     * @param {number} size - message size.
     */
    protected abstract readAs<T>(msg0: M, type: string, start: number, size: number): T;
}
