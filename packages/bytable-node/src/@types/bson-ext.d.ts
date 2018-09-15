/// <reference types="node" />

declare module 'bson-ext' {
    export class BSON {
        constructor();
    
        /**
         * Serialize a Javascript object.
         * 
         * @param {object} object The Javascript object to serialize.
         * @return The Buffer object containing the serialized object.
         */
        serialize(object: object): Buffer;
    
        /**
         * Deserialize BSON into a Javascript object.
         * @param {Buffer} bson - buffer
         * @return The Javascript object.
         */
        deserialize(bson: Buffer): object;
    }
}
