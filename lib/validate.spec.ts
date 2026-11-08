import { ValidationError } from "./errors";
import { validate } from "./validate";

describe("validate", () => {
  it("accepts a valid query", () => {
    const value = {
      security: "ABC",
      expression: { fn: "*", a: "sales", b: 2 },
    };

    expect(validate(value)).toEqual(value);
  });

  it("accepts a nested expression", () => {
    const value = {
      security: "CDE",
      expression: {
        fn: "-",
        a: { fn: "-", a: "eps", b: "shares" },
        b: { fn: "-", a: "assets", b: "liabilities" },
      },
    };

    expect(validate(value)).toEqual(value);
  });

  it("throws ValidationError when expression is missing", () => {
    const value = {
      wrong: 123,
      security: "BCD",
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow("Query must include an expression object");
  });

  it("throws ValidationError when security is missing", () => {
    const value = {
      expression: { fn: "*", a: "sales", b: 2 },
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow("Query must include a security string");
  });

  it("throws ValidationError when security is not a string", () => {
    const value = {
      security: 123,
      expression: { fn: "*", a: "sales", b: 2 },
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow("Query must include a security string");
  });

  it("throws ValidationError when the root value is not an object", () => {
    expect(() => validate(null)).toThrow(ValidationError);
    expect(() => validate([])).toThrow(ValidationError);
    expect(() => validate("ABC")).toThrow(ValidationError);
  });

  it("throws ValidationError when expression.fn is missing", () => {
    const value = {
      security: "ABC",
      expression: { a: "sales", b: 2 },
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow(
      'Expression must include a string "fn" operator',
    );
  });

  it("throws ValidationError when an operand has an invalid type", () => {
    const value = {
      security: "ABC",
      expression: { fn: "*", a: true, b: 2 },
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow(
      'Operand "a" must be a number, attribute name, or expression',
    );
  });

  it("throws ValidationError when a nested expression is invalid", () => {
    const value = {
      security: "ABC",
      expression: {
        fn: "+",
        a: { fn: "*", a: "sales" },
        b: 2,
      },
    };

    expect(() => validate(value)).toThrow(ValidationError);
    expect(() => validate(value)).toThrow('Expression must include operand "b"');
  });
});
