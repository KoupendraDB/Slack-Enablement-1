const savings = require("../helpers/savings").savings;

describe("Calculation TestCases", () => {
  test("With 2 valid numbers income > expense", () => {
    let saving = savings(40000, 12000);
    expect(saving).toBe(28000);
  });

  test("With 2 valid numbers income < expense", () => {
    let saving = savings(4000, 12000);
    expect(saving).toBe(0);
  });

  test("With 2 valid numbers income = expense", () => {
    let saving = savings(12000, 12000);
    expect(saving).toBe(0);
  });

  test("With invalid numbers", () => {
    let saving = savings('50000', '12000');
    expect(saving).toBe(0);
  });
});
