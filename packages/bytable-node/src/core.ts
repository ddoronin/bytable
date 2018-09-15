import * as BSON from 'bson-ext';

// @ts-ignore
// Get the Long type
var Long = BSON.Long;

// @ts-ignore
// Create a bson parser instance, passing in all the types
// This is needed so the C++ parser has references to the classes and can
// use them to serialize and deserialize the types.
var bson = new BSON([BSON.Binary, BSON.Code, BSON.DBRef, BSON.Decimal128, BSON.Double, BSON.Int32, BSON.Long, BSON.Map, BSON.MaxKey, BSON.MinKey, BSON.ObjectId, BSON.BSONRegExp, BSON.Symbol, BSON.Timestamp]);

export { bson };
