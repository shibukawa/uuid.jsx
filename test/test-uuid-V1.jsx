import "test-case.jsx";
import "base-test.jsx";
import "uuid.jsx";
import "console.jsx";

class _Test extends BaseTest
{
    override function generate () : string
    {
        return UUID.generateV1().toString();
    }

    function test_version_test () : void
    {
        for (var i = 0; i < 16; i++)
        {
            var uuid = UUID.generateV1();
            console.log(uuid.hexString);
            this.expect(uuid.version, "version number field").toBe(1);
            this.property_test(uuid);
        }
    }
}
