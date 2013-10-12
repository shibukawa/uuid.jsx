uuid.jsx
===========================================

Synopsis
---------------

The RFC-compliant UUID generator for JSX

It is JSX port of [UUID.js](https://github.com/LiosK/UUID.js) written by LiosK.

Code Example
---------------

```js
import "uuid.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // Simplest way
        log uuid.generate();

        // v1
        var v1 = uuid.generateV1();
        log uuid.hexString;
        log uuid.binString;
        log uuid.version; // -> 1
        // v4
        var v4 = uuid.generateV4();
        log uuid.namedIntFields.node;
        log uuid.version; // -> 4
    }
}
```

Installation
---------------

```sh
$ npm install uuid.jsx
```

API Reference / UUID class methods
----------------------------------------

### UUID.generate() : string

Returns UUID string.

### UUID.generatev1() : UUID

Returns UUID object it uses V1 algorithm.

### UUID.generatev4() : UUID

Returns UUID object it uses V4 algorithm.

### new UUID(string)

Returns UUID object from hex style UUID string.

### UUID.resetState()

Resets V1 UUID state.

API Reference / UUID instance methods
----------------------------------------

### UUID#toString() : string

Returns UUID string representation in hex.

### UUID#equals(uuid : UUID) : boolean

Tests if two UUID objects are equal.

API Reference / UUID instance property
----------------------------------------

Some properties has type `fileds`. Fields have following properties:

* `timeLow` : T;
* `timeMid` : T;
* `timeHiAndVersion` : T;
* `clockSeqHiAndReserved` : T;
* `clockSeqLow` : T;
* `node` : T;

### UUID#intFields : int[]

List of UUID field values (as integer values).

### UUID#namedIntFields : fields

List of UUID field values (as integer values) by name.

### UUID#bitFields : string[]

List of UUID field values (as binary bit string values).

### UUID#namedBitFields : fields

List of UUID field values by name (as binary bit string values).

### UUID#hexFields : string[]

List of UUID field values (as hexadecimal string values).

### UUID#namedHexFields : fields

List of UUID field values by name(as hexadecimal string values).

### UUID#version : int

UUID version number defined in RFC 4122.

### UUID#bitString : string

128-bit binary bit string representation.

### UUID#hexString : string

UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").

### UUID#urn : string

UUID string representation as a URN ("urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").

Development
-------------

## Repository

* Repository: git://github.com/shibukawa/uuid.jsx.git
* Issues: https://github.com/shibukawa/uuid.jsx/issues

## Run Test

```sh
$ grunt test
```

## Build

```sh
# Generate API reference
$ grunt doc

# Build application or library for JS project
$ grunt build
```

Author
---------

* shibukawa / yoshiki@shibu.jp

License
------------

MIT

Complete license is written in `LICENSE.md`.
