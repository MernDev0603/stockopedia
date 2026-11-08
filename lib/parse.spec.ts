import { ParseError } from "./errors";
import { parse } from "./parse";

describe("parse", () => {
  it("parses valid JSON into a value", () => {
    expect(parse('{"security":"ABC","expression":{"fn":"*","a":"sales","b":2}}')).toEqual({
      security: "ABC",
      expression: { fn: "*", a: "sales", b: 2 },
    });
  });

  it("throws ParseError for malformed JSON", () => {
    const malformed = `{
      "expression": {"fn": "+", "a": "price", "b": "eps"},
      "security": "BCD"
    `;

    expect(() => parse(malformed)).toThrow(ParseError);
    expect(() => parse(malformed)).toThrow("Invalid JSON");
  });

  it("throws ParseError for an empty string", () => {
    expect(() => parse("")).toThrow(ParseError);
    expect(() => parse("")).toThrow("Invalid JSON");
  });
});
