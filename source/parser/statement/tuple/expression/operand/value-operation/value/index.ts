import reduceFirst from "reduce-first";
import { ExpressionNode, parseExpression } from "../../..";
import { ParserNodes, ParseResult } from "../../../../../..";
import { Token, haveTokens, Tokens } from "../../../../../../../lexer";
import { parseNull } from "./null";
import { parseArray } from "./array";
import { parseStruct } from "./struct";
import { parseBoolean } from "./boolean";
import { parseFloatValue } from "./float";
import { parseIntegerValue } from "./integer";
import { parseString } from "./string";
import { parseIdentifier } from "./identifier";
import { parseFunction } from "./function";

export type ValueNode = ParserNodes<typeof parsers>;

const parsers = [
  parseArray,
  parseStruct,
  parseNull,
  parseBoolean,
  parseFloatValue,
  parseIntegerValue,
  parseString,
  parseIdentifier,
  parseFunction
];

export function parseValue(tokens: Token[]): ParseResult<ValueNode | ExpressionNode> {
  if(haveTokens(tokens, Tokens.open_round)) { // TODO - this wont work with function
    const result = parseExpression(tokens.slice(1));
    if(result && haveTokens(result.tokens, Tokens.close_round)) {
      return {
        tokens: result.tokens.slice(1),
        node: result.node
      };
    }
  }
  return reduceFirst(parsers, (parser) => {
    return parser(tokens);
  });
}
