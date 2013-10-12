import "test-case.jsx";
import "base-test.jsx";
import "uuid.jsx";

class _Test extends BaseTest
{
    override function generate () : string
    {
        return UUID.generate();
    }

    override function test_version4_format_tests () : void
    {
        super.test_version4_format_tests();
    }

    override function test_reserved_bit_tests () : void
    {
        super.test_reserved_bit_tests();
    }

    override function test_collision_test () : void
    {
        super.test_collision_test();
    }

    override function test_four_sigma_tests_for_random_bits () : void
    {
        super.test_four_sigma_tests_for_random_bits();
    }
}
