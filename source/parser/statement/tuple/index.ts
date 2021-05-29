import reduceFirst from "reduce-first";
import { ParseResult } from "../..";
import { haveTokens, haveTokensIn, Token, Tokens } from "../../../lexer";
import { ASTNode, Kinds } from "../../node";
import { ExpressionNode, parseExpression } from "./expression";
import { parseVoid } from "./void";

export interface TupleNode extends ASTNode {
  kind: Kinds.tuple;
  expressions: ExpressionNode[];
}

const tupleEndTokens = [
  Tokens.semi,
  Tokens.close_round,
  Tokens.close_square
];

const parsers = [
  parseExpression,
  parseVoid
];

export function parseTuple(tokens: Token[]): ParseResult<TupleNode> {
  const result: ParseResult<TupleNode> = {
    tokens,
    node: {
      kind: Kinds.tuple,
      expressions: []
    }
  };
  while(!haveTokensIn(result.tokens, tupleEndTokens)) {
    const expressionResult = reduceFirst(parsers, (parser) => {
      return parser(result.tokens);
    });
    if(expressionResult && haveTokens(expressionResult.tokens, Tokens.comma)) {
      result.tokens = expressionResult.tokens.slice(1);
      result.node.expressions.push(expressionResult.node);
    } else {
      throw new Error("Syntax error");
    }
  }
  return result;
}
