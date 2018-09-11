# Bytable

The core package representing a general-purpose binary serializer.

## Byte Table

Every data object can be described by this table that I call "Byte Table". For example, for an HTTP Request with a string field `requestId`, integer fields `index` and `count` and some `paylod` the table could be:

| FIELD          | TYPE              | SIZE (bytes) | SHIFT (bytes) |
| -------------- | ----------------- | ------------ | ------------- |
| requestId_SIZE | UInt32BE          | 4            | 0             |
| requestId      | String            | 123          | 4             |
| index          | UInt8             | 1            | 127           |
| count          | UInt16BE          | 2            | 128           |
| payload_SIZE   | UInt32BE          | 4            | 130           |
| payload        | BSON              | 42           | 134           |

## Static & Dynamic Types

Let's call static types low-level fixed-size types such as integer (`Int8`, `Int16` and `Int32`), unsigned integer (`UInt8`, `UInt16` and `UInt32`), floating point numbers (`Float` and `Double`) and boolean. These types can be described with two invariant parameters: byte shift and size. For example, if the number is `Int16` and it's shifted in memory for `x` bytes, than it can be parsed from binary slice starting at `x` and ending at `x + 2` (`Int16` size is 2 bytes). The same methodoligy is applicable for any other type with fixed size.

Dynamic Types are variable size types, such as `String`, `BSON` or raw `Binary`. For these types a shift is invariant, but a size is not. Let's assume that the size is not larger than `UInt32.Max`. In this case any dynamic type could be represented as combination of header `SIZE` and body `<Binary>`. For example, `String` will require header `UInt32` (holding the size of the string in bytes) and binary version of the given string.

## API

This library exposes two abstract classes: Reader and Writer. Implementations are platform-specific (very different for browser and nodejs).

### Reader

```typescript
export abstract class Reader<T, M> {
    /**
     * Reads `size` bytes of the binary message of given `type` starting with position `start`.
     * Should be implemented in child classes.
     * @param {M} msg0 - binary message.
     * @param {string} type - type of data encoded in bytes between start and start + size.
     * @param {number} start - starting position.
     * @param {number} size - message size.
     */
    protected abstract readAs<In>(msg0: M, type: In, start: number, size: number): Out<In>;
}

```

### Writer

```typescript
export abstract class Writer<T, M> {
    protected abstract alloc(size: number): M;
    protected abstract dynamicToBinary(type: string, value: any): any;
    protected abstract writeAs(m: M, type: string, value: any, shift: number): any;
}
```

## Usage

To get an idea of usage look at these two implementations:

1. NodeJS implementation can be found here: [`bytable-node`](/packages/bytable-node)

2. Browser - [`bytable-client`](/packages/bytable-client)
