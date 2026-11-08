import { ValidationError } from "./errors";
import { Expression, Operand } from "./expression";
import { Query } from "./query";

export function validate(value: unknown): Query {
  if (!isPlainObject(value)) {
    throw new ValidationError("Query must be a JSON object");
  }

  if (typeof value.security !== "string") {
    throw new ValidationError("Query must include a security string");
  }

  if (!isPlainObject(value.expression)) {
    throw new ValidationError("Query must include an expression object");
  }

  return {
    security: value.security,
    expression: validateExpression(value.expression),
  };
}

function validateExpression(value: Record<string, unknown>): Expression {
  if (typeof value.fn !== "string") {
    throw new ValidationError('Expression must include a string "fn" operator');
  }

  if (!("a" in value)) {
    throw new ValidationError('Expression must include operand "a"');
  }

  if (!("b" in value)) {
    throw new ValidationError('Expression must include operand "b"');
  }

  return {
    fn: value.fn,
    a: validateOperand(value.a, "a"),
    b: validateOperand(value.b, "b"),
  };
}

function validateOperand(value: unknown, label: "a" | "b"): Operand {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new ValidationError(
        `Operand "${label}" must be a number, attribute name, or expression`,
      );
    }
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  if (isPlainObject(value)) {
    return validateExpression(value);
  }

  throw new ValidationError(
    `Operand "${label}" must be a number, attribute name, or expression`,
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
