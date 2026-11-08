import { evaluate } from "./evaluate";
import { EvaluationError, LookupError } from "./errors";
import { Expression } from "./expression";

describe("evaluate", () => {
  it("adds two number literals", () => {
    const expression: Expression = { fn: "+", a: 3, b: 5 };

    expect(evaluate(expression, 1)).toBe(8);
  });

  it("multiplies an attribute by a number", () => {
    // ABC (securityId 1): sales = 4 → 4 * 2 = 8
    const expression: Expression = { fn: "*", a: "sales", b: 2 };

    expect(evaluate(expression, 1)).toBe(8);
  });

  it("subtracts an attribute on the b side from a number", () => {
    // ABC (securityId 1): sales = 4 → 10 - 4 = 6
    const expression: Expression = { fn: "-", a: 10, b: "sales" };

    expect(evaluate(expression, 1)).toBe(6);
  });

  it("divides two attributes", () => {
    // BCD (securityId 2): price = 2, eps = 4 → 2 / 4 = 0.5
    const expression: Expression = { fn: "/", a: "price", b: "eps" };

    expect(evaluate(expression, 2)).toBe(0.5);
  });

  it("evaluates nested expressions", () => {
    // CDE (securityId 3): (eps - shares) - (assets - liabilities)
    // (6 - 30) - (21 - 24) = -24 - (-3) = -21
    const expression: Expression = {
      fn: "-",
      a: { fn: "-", a: "eps", b: "shares" },
      b: { fn: "-", a: "assets", b: "liabilities" },
    };

    expect(evaluate(expression, 3)).toBe(-21);
  });

  it("throws LookupError for an unknown attribute", () => {
    const expression: Expression = { fn: "*", a: "unknown", b: 2 };

    expect(() => evaluate(expression, 1)).toThrow(LookupError);
    expect(() => evaluate(expression, 1)).toThrow(
      'Unknown attribute: "unknown"',
    );
  });

  it("throws LookupError for an unknown attribute nested in an operand", () => {
    const expression: Expression = {
      fn: "+",
      a: { fn: "*", a: "missing", b: 2 },
      b: 1,
    };

    expect(() => evaluate(expression, 1)).toThrow(LookupError);
    expect(() => evaluate(expression, 1)).toThrow(
      'Unknown attribute: "missing"',
    );
  });

  it("throws LookupError when a fact is missing", () => {
    const expression: Expression = { fn: "*", a: "sales", b: 2 };

    expect(() => evaluate(expression, 999)).toThrow(LookupError);
    expect(() => evaluate(expression, 999)).toThrow(
      'No fact for attribute "sales" on security id 999',
    );
  });

  it("throws EvaluationError when dividing by zero", () => {
    const expression: Expression = { fn: "/", a: "price", b: 0 };

    expect(() => evaluate(expression, 1)).toThrow(EvaluationError);
    expect(() => evaluate(expression, 1)).toThrow("Division by zero");
  });

  it("throws EvaluationError for an unknown operator", () => {
    const expression: Expression = { fn: "%", a: 1, b: 2 };

    expect(() => evaluate(expression, 1)).toThrow(EvaluationError);
    expect(() => evaluate(expression, 1)).toThrow('Unknown operator: "%"');
  });
});
