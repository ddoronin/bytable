## `Bytable` - The Core Package
[![npm version](https://img.shields.io/npm/v/bytable.svg?style=flat-square)](https://www.npmjs.com/package/bytable)

The terminology defined here by author should introduce core concepts and principals the library is relying on.

## Byte Table

Byte Table is a data structure describing memory allocation for underlying binary representation of a data object. It can be visualized as a table with 3 columns: type, offset and size, - the rows are corresponding object fields. 

For illustration purpose let's keep tracking the fields' names. Than, for instance, a typical POST HTTP Request with a string field `requestId`, integer fields `index` and `count` and `paylod` could be visualized as:

| FIELD          | TYPE              | SIZE (bytes) | SHIFT (bytes) |
| -------------- | ----------------- | ------------ | ------------- |
| requestId_SIZE | UInt32BE          | 4            | 0             |
| requestId      | String            | 123          | 4             |
| index          | UInt8             | 1            | 127           |
| count          | UInt16BE          | 2            | 128           |
| payload_SIZE   | UInt32BE          | 4            | 130           |
| payload        | BSON              | 42           | 134           |

*Dynamic fields are accomponied with a header holding the field size. The name of this header has a suffix "_SIZE" by convention.*

## Static & Dynamic Types

Static Types are low-level fixed-size (known at compiler time) types limited to integer (`Int8`, `Int16` and `Int32`), unsigned integer (`UInt8`, `UInt16` and `UInt32`), floating point (`Float` and `Double`) and boolean. To map the data of static types into a binary format it's enought to set two parameters: offset and size. Offset is showing for how many bytes the data is shifted in memory. The size is a number of bytes to be allocated in memory starting with the offset pointer.

Dynamic Types are low-level types of dynmic sizes known only at runtime. Supported out of the box dynamic types are  `String`, `BSON` and raw `Binary`. Each field of dynamic type could be a combination of a static type header holding the data size (bynary length) and a body of this size. By convention this header name is suffixed with "_SIZE" and the default type of it is `UInt32` (limiting max capacity of dynamic type field to `UInt32.Max` bytes that should be more than enough in 99% cases).

## Object Metadata

By design byte tables should compliment serializable classes. The best option available today in javascript or typescript is decorators.
The linbrary exposes a set of decorators, which can attach platform-agnostic types to javascript objects.

Each serializable class should be decorated with `@proto` (from protocol), each seriazable field - with one of the decorators from this table:

| Group            | Decorator  | Aliases  | Size (bytes) |
| ---------------- | ---------- | ---------| -------------|
| Unsigned Integer | @uint8     | @u8      | 1            |
|                  | @uint16    | @u16     | 2            |
|                  | @uint32    | @u32     | 4            |
| Signed Integer   | @int8      | @i8      | 1            |
|                  | @int16     | @i16     | 2            |
|                  | @int32     | @i32     | 4            |
| Floatin Point    | @float     | @f       | 4            |
|                  | @double    | @d       | 8            |
| Boolean          | @boolean   | @bool    | 1            |
| String           | @string    | @s       | dynamic      |
| Raw Binary       | @binary    |          | dynamic      |
| BSON             | @bson      | @obj     | dynamic      |


And here is a TypeScript example:

```typescript
import { proto, uint8, uint16, bson, string } from 'bytable';

@proto
class Request {
    @string
    requestId: string;

    @uint8
    readonly index: number;

    @uint16
    readonly count: number;

    @bson
    payload: IPayload;
}
```
The underlying Byte Table, generated in run-time, can be found at the top of the spec.

## Platform Specific

The next step is to get the object byte table + data and produce raw binary. Two abstract classes are exposed: Reader and Writer. The Implementation is not included in the core library sicnce it's platform-specific and would be  completely different and incompatible for nodejs and browsers.


To get an idea of implementation please check out these two projects:

1. [`bytable-node`](/packages/bytable-node) is a nodejs implementation.

2. [`bytable-client`](/packages/bytable-client) is for browsers.

Reader and Writer cover binary serialization and deserialization based on the underlying byte table.

## References

Here will be a list of publications.
