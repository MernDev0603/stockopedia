import {
  EvaluationError,
  LookupError,
  ParseError,
  ValidationError,
} from "./errors";
import { interpret } from "./interpret";

describe("interpret", () => {
  it("evaluates the multiplication example", () => {
    const dsl = `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`;

    expect(interpret(dsl)).toBe(8);
  });

  it("evaluates the division example", () => {
    const dsl = `{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`;

    expect(interpret(dsl)).toBe(0.5);
  });

  it("evaluates the nested expression example", () => {
    const dsl = `{
  "expression": {
    "fn": "-",
    "a": {"fn": "-", "a": "eps", "b": "shares"},
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
  },
  "security": "CDE"
}`;

    expect(interpret(dsl)).toBe(-21);
  });

  it("throws ParseError for malformed JSON", () => {
    const dsl = `{
  "expression": {"fn": "+", "a": "price", "b": "eps"},
  "security": "BCD"
`;

    expect(() => interpret(dsl)).toThrow(ParseError);
  });

  it("throws ValidationError for an invalid DSL shape", () => {
    const dsl = `{
  "wrong": 123,
  "security": "BCD"
}`;

    expect(() => interpret(dsl)).toThrow(ValidationError);
  });

  it("throws LookupError for an unknown security", () => {
    const dsl = `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ZZZ"
}`;

    expect(() => interpret(dsl)).toThrow(LookupError);
    expect(() => interpret(dsl)).toThrow('Unknown security: "ZZZ"');
  });

  it("throws LookupError for an unknown attribute", () => {
    const dsl = `{
  "expression": {"fn": "*", "a": "not_an_attribute", "b": 2},
  "security": "ABC"
}`;

    expect(() => interpret(dsl)).toThrow(LookupError);
    expect(() => interpret(dsl)).toThrow(
      'Unknown attribute: "not_an_attribute"',
    );
  });

  it("throws EvaluationError when dividing by zero", () => {
    const dsl = `{
  "expression": {"fn": "/", "a": "price", "b": 0},
  "security": "ABC"
}`;

    expect(() => interpret(dsl)).toThrow(EvaluationError);
    expect(() => interpret(dsl)).toThrow("Division by zero");
  });
});
