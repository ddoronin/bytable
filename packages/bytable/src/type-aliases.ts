import { 
    uint8, uint16, uint32,
    int8, int16, int32,
    float, double,
    boolean,
    bson,
    binary,
    string
} from './types';

export const u8     = uint8;
export const ubyte  = uint8;

export const u16    = uint16;
export const ushort = uint16;

export const u32    = uint32;
export const uint   = uint32;

export const i8     = int8;
export const byte   = int8;

export const i16    = int16;
export const short  = int16;

export const i32    = int32;
export const int    = int32;

export const f      = float;
export const d      = double;
export const number = double;

export const bool   = boolean;

export const s      = string;
export const str    = string;

export const o      = bson;
export const object = bson;

export const b      = binary;