import "uuid.jsx";
import "test-case.jsx";

abstract class BaseTest extends TestCase
{
    static const sizes = [32, 16, 16, 8, 8, 48];
    static const names = ["timeLow", "timeMid", "timeHiAndVersion", "clockSeqHiAndReserved", "clockSeqLow", "node"];
    static const patHex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|0{8}-0{4}-0{4}-0{4}-0{12}$/;
    static const patBit  = /^[01]{48}0(?:001|010|011|100|101)[01]{12}10[01]{62}|0{128}$/;
    static const v4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    var ubounds : int[];
    static const n = 16384;

    abstract function generate () : string;

    override function setUp() : void
    {
        this.ubounds = [] : int[];
        for (var i = 0; i < 6; i++)
        {
            this.ubounds[i] = Math.pow(2, BaseTest.sizes[i]);
        }
    }

    function generateUUIDs () : string[]
    {
        var uuids = [] : string[];
        for (var i = 0; i < BaseTest.n; i++)
        {
            uuids[i] = this.generate();
        }
        return uuids;
    }

    function test_version4_format_tests () : void
    {
        var uuids = this.generateUUIDs();
        for (var i = 0; i < uuids.length; i++)
        {
            var uuid = uuids[i];
            this.expect(BaseTest.v4.test(uuid), "version4 format test: " + uuid).toBe(true);
        }
    }

    function _countUp() : int[]
    {
        var uuids = this.generateUUIDs();
        var counts = [] : int[];
        for (var i = 0; i < 128; i++)
        {
            counts[i] = 0;
        }
        for (var i = 0; i < uuids.length; i++)
        {
            // loop to count each bit's '1'
            var uuid = uuids[i];
            for (var sp = 0, np = 0, len = uuid.length; sp < len; sp++)
            {
                if (uuid.charAt(sp) == "-") { continue; }
                var nibble = Number.parseInt(uuid.charAt(sp), 16);
                if (nibble & 1) { counts[np * 4 + 3]++; }
                if (nibble & 2) { counts[np * 4 + 2]++; }
                if (nibble & 4) { counts[np * 4 + 1]++; }
                if (nibble & 8) { counts[np * 4 + 0]++; }
                np++;
            }
        }
        return counts;
    }

    function test_reserved_bit_tests () : void
    {
        var counts = this._countUp();
        this.expect(counts[64], "bit 64: variant bit '1'").toBe(BaseTest.n);
        this.expect(counts[65], "bit 65: variant bit '0'").toBe(0);

        this.expect(counts[48], "bit 48: version bit '0'").toBe(0);
        this.expect(counts[49], "bit 49: version bit '1'").toBe(BaseTest.n);
        this.expect(counts[50], "bit 50: version bit '0'").toBe(0);
        this.expect(counts[51], "bit 51: version bit '0'").toBe(0);
    }

    function test_collision_test () : void
    {
        var uuids = this.generateUUIDs();
        var ncollisions = 0;
        var table = {} : Map.<int>;
        for (var i = 0, len = uuids.length; i < len; i++)
        {
            if (table.hasOwnProperty(uuids[i]))
            {
                ncollisions++;
                table[uuids[i]]++;
            }
            else
            {
                table[uuids[i]] = 1;
            }
        }
        this.expect(ncollisions, "count of collisions among " + BaseTest.n as string + " UUIDs").toBe(0);
    }

    function test_four_sigma_tests_for_random_bits () : void
    {
        var counts = this._countUp();
        // (possible to fail in a certain low probability)
        var mean = BaseTest.n * 0.5, sd = Math.sqrt(BaseTest.n * 0.5 * 0.5);  // binom dist
        var lbound = mean - 4 * sd, ubound = mean + 4 * sd;

        for (var i = 0; i < 128; i++)
        {
            var c = counts[i];
            switch (i)
            {
            case 64:
            case 49:
                this.expect(c, "bit " + i + ": reserved bit '1'").toBe(BaseTest.n);
                break;
            case 65:
            case 48:
            case 50:
            case 51:
                this.expect(c, "bit " + i + ": reserved bit '0'").toBe(0);
                break;
            default:
                this.expect(lbound < c && c < ubound, "bit " + i + ": random bit " + c + " (allowable range: " + lbound + "-" + ubound + ")").toBe(true);
                break;
            }
        }
    }

    function property_test (uuid : UUID) : void
    {
        this.expect(uuid instanceof UUID, "object instanceof UUID").toBe(true);
        this.expect((uuid.version == 1) || (uuid.version == 2) || (uuid.version == 3) ||
            (uuid.version == 4) || (uuid.version == 5), "UUID#version in (1-5)").toBe(true);
        this.expect(BaseTest.patHex.test(uuid.hexString), "UUID#hexString matches" + BaseTest.patHex.toString()).toBe(true);
        this.expect(BaseTest.patBit.test(uuid.bitString), "UUID#bitString matches " + BaseTest.patBit.toString()).toBe(true);

        this.expect(uuid.hexString, "UUID#hexString == UUID#toString()").toBe(uuid.toString());
        this.expect("urn:uuid:" + uuid.hexString, "'urn:uuid:' + UUID#hexString == UUID#urn").toBe(uuid.urn);

        this.expect(uuid.bitFields.join(""), "joined bitFields equals bitString").toBe(uuid.bitString);
        this.expect(uuid.hexFields.slice(0, 4).join("-") + uuid.hexFields.slice(4).join("-"), "joined hexFields equals hexString").toBe(uuid.hexString);

        this.expect(uuid.intFields.length, "length of intFields list").toBe(6);
        this.expect(uuid.bitFields.length, "length of bitFields list").toBe(6);
        this.expect(uuid.hexFields.length, "length of hexFields list").toBe(6);
    }
}
