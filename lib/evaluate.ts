import { EvaluationError, LookupError } from "./errors";
import { Expression, Operand } from "./expression";
import { findAttributeByName, getFactValue } from "./lookup";
import { operators } from "./operators";

export function evaluate(expression: Expression, securityId: number): number {
  const a = resolveOperand(expression.a, securityId);
  const b = resolveOperand(expression.b, securityId);

  const operator = operators[expression.fn];
  if (!operator) {
    throw new EvaluationError(`Unknown operator: "${expression.fn}"`);
  }

  return operator(a, b);
}

function resolveOperand(operand: Operand, securityId: number): number {
  if (typeof operand === "number") {
    return operand;
  }

  if (typeof operand === "string") {
    return lookupAttributeValue(operand, securityId);
  }

  return evaluate(operand, securityId);
}

function lookupAttributeValue(name: string, securityId: number): number {
  const attribute = findAttributeByName(name);
  if (!attribute) {
    throw new LookupError(`Unknown attribute: "${name}"`);
  }

  const value = getFactValue(securityId, attribute.id);
  if (value === undefined) {
    throw new LookupError(
      `No fact for attribute "${name}" on security id ${securityId}`,
    );
  }

  return value;
}
