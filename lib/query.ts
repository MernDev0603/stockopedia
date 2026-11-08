import { Expression } from "./expression";

export interface Query {
  security: string;
  expression: Expression;
}
