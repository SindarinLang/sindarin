import reduceFirst from "reduce-first";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ParserNodes, PotentialParseResult } from "../../..";
import { parseExpression } from "..";
import { parseNull } from "./null";
import { parseArray } from "./array";
import { parseBoolean } from "./boolean";
import { parseFloatValue } from "./float";
import { parseIntegerValue } from "./integer";

import { parseString } from "./string";
import { parseIdentifier } from "./identifier";
import { parseStruct } from "./struct";
import { parseFunction } from "./function";
import { parseVoid } from "./void";

export type ValueNode = ParserNodes<typeof parsers>;

const parsers = [
  parseNull,
  parseArray,
  parseBoolean,
  parseFloatValue,
  parseIntegerValue
];

export function parseValue(tokens: Token[]): PotentialParseResult<ValueNode> {
  // TODO - tuple with commas - 1, 2 or (1, 2)
  if(haveTokens(tokens, Tokens.open_round)) {
    const result = parseExpression(tokens.slice(1));
    if(haveTokens(result.tokens, Tokens.close_round)) {
      return {
        tokens: result.tokens.slice(1),
        node: result.node
      };
    } else {
      throw new Error("syntax error");
    }
  } else {
    return reduceFirst(parsers, (parser) => {
      return parser(tokens);
    });
  }
}
