## `Bytable` - The Core Package
[![npm version](https://img.shields.io/npm/v/bytable.svg?style=flat-square)](https://www.npmjs.com/package/bytable)

The platform-agnostic library used as a core building block for browser and nodejs binary serializers. Before using this package check out [`bytable-node`](/packages/bytable-node) and [`bytable-client`](/packages/bytable-client).

```bash
npm install bytable
```

The terminology defined here by [author](https://www.linkedin.com/in/ddoronin) will introduce core concepts and principals the library is relying on.

## Byte Table

Byte Table is a data structure describing memory allocation for underlying binary representation of an object. It can be visualized as a table with three key columns: type, offset and size, - the rows are corresponding class fields. 

|             | TYPE    | OFFSET (bytes)  | SIZE (bytes)|
| ----------- | ------- | --------------- | ----------- |
| class field | string  | number          | number      |

*Please see example below.*

## Static & Dynamic Types

Static Types are atomic fixed-size types (the size is known at compile time). There are limited to integer (`Int8`, `Int16` and `Int32`), unsigned integer (`UInt8`, `UInt16` and `UInt32`), floating point (`Float` and `Double`) and boolean (`Boolean`). A projection of static type data into binary representation can be identified by two parameters: offset and size. Offset is showing for how many bytes the data is shifted in memory. The size is a number of bytes to be allocated in memory starting with the offset pointer.

Dynamic Types are atomic types of dynmic sizes known only at run-time. Supported out of the box dynamic types are  `String` and raw `Binary`, but it can be extended with `BSON`, for instance. A dynamic type is a combination of a static type header saying the data size (bynary length) and body of this size. By convention a header name is suffixed with "_SIZE" and it's `UInt32` (i.e. max capacity of dynamic type is limited by `UInt32.Max` bytes).

## Object Metadata

By design byte tables should compliment serializable classes. Probably the best option available today in javascript or typescript is decorators.
The linbrary exposes a set of decorators, which can attach platform-agnostic types to javascript objects.

Each serializable class should be decorated with `@proto` (from protocol) and each seriazable field - with one of the decorators from a table below.

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


Here is a typical POST Request class written in TypeScript with type decorators:

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
The underlying Byte Table, generated in run-time:

| FIELD          | TYPE              | OFFSET (bytes) | SIZE (bytes) |
| -------------- | ----------------- | -------------- | ------------- |
| requestId_SIZE | UInt32BE          | 0              | 4             |
| requestId      | String            | 4              | 123           |
| index          | UInt8             | 127            | 1             |
| count          | UInt16BE          | 128            | 2             |
| payload_SIZE   | UInt32BE          | 130            | 4             |
| payload        | BSON              | 134            | 42            |

*Dynamic fields are accomponied with a header holding the field size. The name of this header has a suffix "_SIZE" by convention.*

## Platform Specific

The next step is to convert an object into raw binary using a byte table. Two abstract classes are responsible for this: Reader and Writer. They are a layer of abstraction exposed to the library consumers, which should implement platform-specific bindings such as memory allocation and read/write from static types.

NodeJS and Browser implementations:

- [`bytable-node`](/packages/bytable-node)

- [`bytable-client`](/packages/bytable-client)

Summarizing there are two fundamental points of extension: Reader/Writer and decorators for custom dynamic types such as BSON.

<h1>
    <p style="text-align: center">
        The End
    <p>
</h1>