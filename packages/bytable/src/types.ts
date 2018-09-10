import { $$types } from './proto';

function isInitialize(map: any): map is Map<string, string> {
    return typeof map !== 'undefined';
}

const at = (type: string) => (o: any, fieldName: string | symbol): void => {
    if(!isInitialize(o[$$types])) {
        o[$$types] = new Map<string, string>();
    }
    o[$$types].set(fieldName, type);
}

export const DYNAMIC_SIZE_TYPE = 'UInt32BE';
export const BINARY            = 'binary';

// Integer
export const uint8   = at('UInt8');
export const uint16  = at('UInt16BE');
export const uint32  = at('UInt32BE');

export const int8    = at('Int8');
export const int16   = at('Int16BE');
export const int32   = at('Int32BE');

// Float & Double
export const float   = at('FloatBE');
export const double  = at('DoubleBE');

// Boolean
export const boolean = uint8;

// BSON
export const bson    = at('BSON');

// String
export const string  = at('String');

// Binary
export const binary  = at('Binary');

/**
 * Map of known types and sizes in bytes.
 */
export const byteMap = new Map<string, number>([
/* +-----------+--------------+
 * | Type      | Size (bytes) |
 * +-----------+--------------+ */
    ['UInt8',       1],
    ['UInt16BE',    2],
    ['UInt32BE',    4],

    ['Int8',        1],
    ['Int16BE',     2],
    ['Int32BE',     4],

    ['FloatBE',     4],
    ['DoubleBE',    8],
]);

/**
 * Static Types
 * - types with fixed memory space, e.g. 
 * UInt8, Int8, UInt16, etc.
 */
export const staticTypes = new Set(byteMap.keys());
