import { getEnum } from "../../../../utils";
import { Context, nextContext } from "../context";

export type RawTokenKind = keyof typeof rawTokens;

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
  infinity: "infinity",
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

export type RawTokens = keyof typeof RawTokens;

export const RawTokens = getEnum(rawTokens);

const sorted = (Object.keys(rawTokens) as RawTokenKind[]).sort((a, b) => {
  return rawTokens[b].length - rawTokens[a].length;
});

export function getRawToken(context: Context): Context {
  const kind = sorted.find((token) => context.file.contents.startsWith(rawTokens[token]));
  if(kind) {
    return nextContext(context, kind, rawTokens[kind]);
  } else {
    return context;
  }
}

