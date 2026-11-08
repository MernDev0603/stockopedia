import { ParseError } from "./errors";

export function parse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new ParseError("Invalid JSON");
  }
}
