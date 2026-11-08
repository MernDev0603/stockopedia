export type Operand = number | string | Expression;

export interface Expression {
  fn: string;
  a: Operand;
  b: Operand;
}
