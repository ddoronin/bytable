/**
 * Describes protocol for binary presentation.
 * One of the ultimate roles of any type is to give information 
 * about how much bytes will be required for binary presentation 
 * of a given variable value.
 * 
 * e.g. typical REST Request can be described as follow:
 * +------------------+-------------------+------------+
 * |  FIELD           | TYPE              | ORIGIN     |
 * +------------------+-------------------+------------+
 * [[ 'requestId_SIZE', 'UInt32BE' ],                   // dynamic type
 *  [ 'requestId',      'requestId_SIZE',   'String' ], // of size requestId_SIZE
 *  [ 'index',          'UInt8' ],
 *  [ 'count',          'UInt16BE' ],
 *  [ 'payload_SIZE',   'UInt32BE' ],                   // dynamic type
 *  [ 'payload',        'payload_SIZE',     'BSON' ]]   // of size requestId_SIZE
 * 
 * Based on the table above and object instance byte shifts can be computed:
 * +------------------+-------------------+------------+------------+
 * |  FIELD           | TYPE              | SIZE       | SHIFT      |
 * +------------------+-------------------+------------+------------+
 * [[ 'requestId_SIZE', 'UInt32BE',         4,           0   ],
 *  [ 'requestId',      'String',           123,         4   ], 
 *  [ 'index',          'UInt8',            1,           127 ],
 *  [ 'count',          'UInt16BE',         2,           128 ],
 *  [ 'payload_SIZE',   'UInt32BE',         4,           130 ],
 *  [ 'payload',        'BSON',             42,          134 ]]
 */

 /**
  * Object field name to be converted in binary.
  */
export type Field       = string;

/**
 * Object field mapped type to be converted in binary.
 */
export type Type        = string;

/**
 * Object field original type.
 * This type can be different in case of dynamics (String or BSON).
 */
export type Origin      = string;

/**
 * Size in bytes.
 */
export type Size        = number;

/**
 * Shift in bytes.
 */
export type Shift       = number;

/**
 * Protocol table.
 */
export type ProtoTable  = Array<[ Field, Type, Origin? ]>;

/**
 * Protocol table with byte shifts.
 */
export type ByteShiftProtoTable  = Array<[ Field, Type, Size, Shift ]>;
