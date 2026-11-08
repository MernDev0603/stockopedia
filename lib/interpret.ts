import { evaluate } from "./evaluate";
import { LookupError } from "./errors";
import { findSecurityBySymbol } from "./lookup";
import { parse } from "./parse";
import { validate } from "./validate";

export function interpret(text: string): number {
  const parsed = parse(text);
  const query = validate(parsed);

  const security = findSecurityBySymbol(query.security);
  if (!security) {
    throw new LookupError(`Unknown security: "${query.security}"`);
  }

  return evaluate(query.expression, security.id);
}
