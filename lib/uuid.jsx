/**
 * The RFC-compliant UUID generator for JSX
 *
 * @author shibukawa
 *
 * @see https://github.com/shibukawa/uuid.jsx
 *
 * License: MIT
 */

class UUIDFields.<T>
{
    var timeLow : T;
    var timeMid : T;
    var timeHiAndVersion : T;
    var clockSeqHiAndReserved : T;
    var clockSeqLow : T;
    var node : T;

    function set (index : int, value : T) : void
    {
        switch (index)
        {
        case 0:
            this.timeLow = value;
            break;
        case 1:
            this.timeMid = value;
            break;
        case 2:
            this.timeHiAndVersion = value;
            break;
        case 3:
            this.clockSeqHiAndReserved = value;
            break;
        case 4:
            this.clockSeqLow = value;
            break;
        case 5:
            this.node = value;
            break;
        }
    }
}

class UUID
{
    /// Names of each UUID field.
    static const FIELD_NAMES = [
        "timeLow",
        "timeMid",
        "timeHiAndVersion",
        "clockSeqHiAndReserved",
        "clockSeqLow",
        "node"
    ];

    /// Sizes of each UUID field.
    static const FIELD_SIZES = [32, 16, 16, 8, 8, 48];

    /// List of UUID field values (as integer values).
    var intFields : int[];

    /// List of UUID field values (as integer values) by name.
    var namedIntFields : UUIDFields.<int>;

    /// List of UUID field values (as binary bit string values).
    var bitFields : string[];

    /// List of UUID field values by name (as binary bit string values).
    var namedBitFields : UUIDFields.<string>;

    /// List of UUID field values (as hexadecimal string values).
    var hexFields : string[];

    /// List of UUID field values by name(as hexadecimal string values).
    var namedHexFields : UUIDFields.<string>;

    /// UUID version number defined in RFC 4122.
    var version : int;

    /// 128-bit binary bit string representation.
    var bitString : string;

    /// UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
    var hexString : string;

    /// UUID string representation as a URN ("urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
    var urn : string;

    function constructor (timeLow : string, timeMid : string, timeHiAndVersion : string, clockSeqHiAndReserved : string, clockSeqLow : string, node : string)
    {
        this._init([timeLow as number, timeMid as number, timeHiAndVersion as number, clockSeqHiAndReserved as number, clockSeqLow as number, node as number]);
    }

    function constructor (timeLow : number = 0, timeMid : number = 0, timeHiAndVersion : number = 0, clockSeqHiAndReserved : number = 0, clockSeqLow : number = 0, node : number = 0)
    {
        this._init([timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node]);
    }

   /**
    * Converts hexadecimal UUID string to an UUID object.
    * @param strId UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
    */
   function constructor (strId : string)
   {
        var p = /^\s*(urn:uuid:|\{)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{2})([0-9a-f]{2})-([0-9a-f]{12})(\})?\s*$/i;
        var r = p.exec(strId);
        if (r)
        {
            var l = r[1] ? r[1] : "";
            var t = r[8] ? r[8] : "";
            if (((l + t) == "") || (l == "{" && t == "}") || (l.toLowerCase() == "urn:uuid:" && t == "")) 
            {
                this._init([Number.parseInt(r[2], 16), Number.parseInt(r[3], 16),
                            Number.parseInt(r[4], 16), Number.parseInt(r[5], 16),
                            Number.parseInt(r[6], 16), Number.parseInt(r[7], 16)]);
            }
        }
        throw new Error("parse error");
    }

    function _init (values : number[]) : void
    {
        this.intFields = [] : int[];
        this.namedIntFields = new UUIDFields.<int>;
        this.bitFields = [] : string[];
        this.namedBitFields = new UUIDFields.<string>;
        this.hexFields = [] : string[];
        this.namedHexFields = new UUIDFields.<string>;

        for (var i = 0; i < 6; i++)
        {
            var bit = _UUID._intAligner(values[i], UUID.FIELD_SIZES[i], 2);
            var hex = _UUID._intAligner(values[i], UUID.FIELD_SIZES[i] / 4, 16);
            this.intFields[i] = values[i];
            this.bitFields[i] = bit;
            this.hexFields[i] = hex;
            this.namedIntFields.set(i, values[i]);
            this.namedBitFields.set(i, bit);
            this.namedHexFields.set(i, hex);
        }

        this.version = (this.namedIntFields.timeHiAndVersion >> 12) & 0xF;
        this.bitString = this.bitFields.join("");
        this.hexString = this.hexFields[0] + "-" + this.hexFields[1] + "-" + this.hexFields[2]
                         + "-" + this.hexFields[3] + this.hexFields[4] + "-" + this.hexFields[5];
        this.urn = "urn:uuid:" + this.hexString;
    }

    /**
     * Returns UUID string representation in hex.
     */
    override function toString () : string
    {
        return this.hexString;
    }

    /**
     * Tests if two UUID objects are equal.
     * @returns True if two {@link UUID} objects are equal.
     */
    function equals (uuid : UUID) : boolean
    {
        for (var i = 0; i < 6; i++)
        {
            if (this.intFields[i] != uuid.intFields[i])
            {
                return false;
            }
        }
        return true;
    }

    /**
     * The simplest function to get an UUID string.
     * @returns A version 4 UUID string.
     */
    static function generate () : string
    {
        return [_UUID._intAligner(_UUID._getRandomInt(32), 8, 16),          // time_low
                "-",
                _UUID._intAligner(_UUID._getRandomInt(16), 4, 16),          // time_mid
                "-",
                _UUID._intAligner(0x4000 | _UUID._getRandomInt(12), 4, 16), // time_hi_and_version
                "-",
                _UUID._intAligner(0x8000 | _UUID._getRandomInt(14), 4, 16), // clock_seq_hi_and_reserved clock_seq_low
                "-",
                _UUID._intAligner(_UUID._getRandomInt(48), 12, 16)].join('');   // node
    }


    /**
     * Re-initializes version 1 UUID state.
     */
    static function resetState () : void
    {
        _UUID._state = new _UUIDState();
    }

    /**
     * Generates a version 1 UUID.
     * @returns A version 1 UUID object.
     */
    static function generateV1 () : UUID
    {
        var now = new Date().getTime();
        var st = _UUID._state;
        if (now != st.timestamp)
        {
            if (now < st.timestamp)
            {
                st.sequence++;
            }
            st.timestamp = now;
            st.tick = _UUID._getRandomInt(4);
        }
        else if (Math.random() < _UUID._tsRatio && st.tick < 9984)
        {
            // advance the timestamp fraction at a probability
            // to compensate for the low timestamp resolution
            st.tick += 1 + _UUID._getRandomInt(4);
        }
        else
        {
            st.sequence++;
        }

        // format time fields
        var tf = _UUID._getTimeFieldValues(st.timestamp);
        var tl = tf['low'] + st.tick;
        var thav = (tf['hi'] & 0xFFF) | 0x1000;  // set version '0001'

        // format clock sequence
        st.sequence &= 0x3FFF;
        var cshar = (st.sequence >>> 8) | 0x80; // set variant '10'
        var csl = st.sequence & 0xFF;

        return new UUID(tl, tf['mid'], thav, cshar, csl, st.node);
    }

    /**
     * Generates a version 4 UUID.
     * @returns A version 4 UUID object.
     */
    static function generateV4 () : UUID
    {
        return new UUID(_UUID._getRandomInt(32), _UUID._getRandomInt(16), // time_low time_mid
                        0x4000 | _UUID._getRandomInt(12),  // time_hi_and_version
                        0x80   | _UUID._getRandomInt(6),   // clock_seq_hi_and_reserved
                        _UUID._getRandomInt(8), _UUID._getRandomInt(48)); // clock_seq_low node
    }
}

class _UUID
{
    static var _tsRatio : number = 1 / 4;
    static var _state : _UUIDState = new _UUIDState();

    /**
     * Returns an unsigned x-bit UUID._getRandomIntom integer.
     * @param x A positive integer ranging from 0 to 53, inclusive.
     * @returns An unsigned x-bit UUID._getRandomIntom integer (0 <= f(x) < 2^x).
     */
    static function _getRandomInt (x : int) : number
    {
        if (x <   0) return NaN;
        if (x <= 30) return (0 | Math.random() * (1 <<      x));
        if (x <= 53) return (0 | Math.random() * (1 <<     30))
                          + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
        return NaN;
    }

    /**
     * Converts an integer to a zero-filled UUID._intAligneradecimal string.
     */
    static function _intAligner (num : number, length : int, radix : int) : string
    {
        var str = num.toString(radix);
        for (var i = length - str.length, z = "0"; i > 0; i >>>= 1, z += z)
        {
            if (i & 1)
            {
                str = z + str;
            }
        }
        return str;
    }

    static function _getTimeFieldValues (time : int) : Map.<number>
    {
        var ts = time - Date.UTC(1582, 9, 15);
        var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
        return  { low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
                  mid: hm & 0xFFFF, hi: hm >>> 16, timestamp: ts };
    }
}

class _UUIDState
{
    var timestamp : number;
    var sequence : number;
    var node : number;
    var tick : number;

    function constructor()
    {
        this.timestamp = 0;
        this.sequence = _UUID._getRandomInt(14);
        // set multicast bit '1'
        this.node = (_UUID._getRandomInt(8) | 1) * 0x10000000000 + _UUID._getRandomInt(40);
        // timestamp fraction smaller than a millisecond
        this.tick = _UUID._getRandomInt(4);
    }
}
