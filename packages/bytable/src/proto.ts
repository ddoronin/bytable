import { ProtoTable } from './ProtoTable';
import { build } from './proto-table-builder';

export const $$types: symbol         = Symbol('types');
export const $$getShiftTable: symbol = Symbol('getShiftTable');

export function proto<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        [$$getShiftTable](): ProtoTable {
            return build((this as any)[$$types]);
        }
    }
}
