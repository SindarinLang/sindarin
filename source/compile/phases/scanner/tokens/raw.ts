import { getEnum } from "../../../../utils";
import { getScanError, ScanPhase } from "..";
import { getResult } from "../result";
import { ReadValue } from "../../reader";
import { Result } from "../..";

export type RawTokenKind = keyof typeof rawTokens;

export type RawTokens = keyof typeof RawTokens;

export const rawTokens = {
  // Keywords
  from: "from",
  import: "import",
  export: "export",
  return: "return",
  // Constants
  true: "true",
  false: "false",
  null: "null",
  // Separators
  colon: ":",
  semi: ";",
  comma: ",",
  open_square: "[",
  close_square: "]",
  open_curly: "{",
  close_curly: "}",
  open_round: "(",
  close_round: ")",
  // Operators
  destruct: "...",
  equals: "==",
  less_than_equals: "<=",
  greater_than_equals: ">=",
  default: "??",
  logical_and: "&&",
  logical_or: "||",
  not_equals: "!=",
  arrow: "=>",
  forward: "->",
  backward: "<-",
  async_forward: "~>",
  async_backward: "<~",
  assign: "=",
  async_assign: "~",
  add: "+",
  subtract: "-",
  less_than: "<",
  greater_than: ">",
  conditional: "?",
  bitwise_and: "&",
  bitwise_or: "|",
  exponent: "^",
  multiply: "*",
  divide: "/",
  dot: ".",
  modulus: "%",
  not: "!",
  // Whitespace
  space: " ",
  newline: "\n"
};

export const RawTokens = getEnum(rawTokens);

const sortedTokens = (Object.keys(rawTokens) as RawTokenKind[]).sort((a, b) => {
  return rawTokens[b].length - rawTokens[a].length;
});

export function getRawToken(context: ReadValue): Result<ScanPhase> {
  const kind = sortedTokens.find((token) => context.contents.startsWith(rawTokens[token]));
  if(kind) {
    return getResult(context, kind, rawTokens[kind]);
  } else {
    return {
      context,
      value: undefined,
      errors: [
        getScanError("No raw token match", context.location)
      ]
    };
  }
}
