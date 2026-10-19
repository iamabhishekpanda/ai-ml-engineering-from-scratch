import unittest
from main import MODULE, REQUIRED, validate_plan


class PlanTests(unittest.TestCase):
    def test_module_name(self):
        self.assertTrue(MODULE)

    def test_complete_plan_is_valid(self):
        result = validate_plan({field: field for field in REQUIRED})
        self.assertTrue(result["valid"])

    def test_missing_field_is_reported(self):
        result = validate_plan({field: field for field in REQUIRED[:-1]})
        self.assertEqual(result["missing"], [REQUIRED[-1]])

    def test_empty_plan_is_invalid(self):
        self.assertFalse(validate_plan({})["valid"])

    def test_extra_fields_do_not_break_validation(self):
        plan = {field: field for field in REQUIRED}
        plan["note"] = "review"
        self.assertTrue(validate_plan(plan)["valid"])


if __name__ == "__main__":
    unittest.main()
