import { EvaluationError } from "./errors";

export type BinaryOperator = (a: number, b: number) => number;

export const operators: Record<string, BinaryOperator> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) {
      throw new EvaluationError("Division by zero");
    }
    return a / b;
  },
};
