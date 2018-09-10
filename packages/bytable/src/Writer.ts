import { ProtoTable } from './ProtoTable';
import { $$getShiftTable } from './proto';
import { toBinary } from './byte-table-builder';

export abstract class Writer<T, M> {
    private readonly instance: T;
    private readonly protoTable: ProtoTable;

    constructor(private C: { new(): T }){
        this.instance = new C();
        this.protoTable = (this.instance as any)[$$getShiftTable]();
    }

    public write(obj: T): M {
        const byteTable = toBinary(obj, this.protoTable, this.dynamicToBinary);
        const totalSize = byteTable.reduce((size, [_, shift]) => size + shift,0);
        const buffer = this.alloc(totalSize);
        let shift = 0;
        byteTable.forEach(([type, size, value]) => {
            this.writeAs(buffer, type, value, shift);
            shift += size as number;
        });
        return buffer;
    };

    protected abstract alloc(size: number): M;
    protected abstract dynamicToBinary(type: string, value: any): any;
    protected abstract writeAs(m: M, type: string, value: any, shift: number): any;
}
