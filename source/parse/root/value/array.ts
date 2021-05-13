import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode } from "../../";
import { parseValue, ValueNode } from ".";

export const arrayKind = "array";

export type ArrayKind = typeof arrayKind;

export interface ArrayNode extends ASTNode {
  kind: ArrayKind;
  value: ValueNode[];
}

export function parseArray(tokens: Token[]): ParseResult<ArrayNode> {
  const result: ParseResult<ArrayNode> = {
    tokens: tokens.slice(1),
    node: {
      kind: arrayKind,
      value: []
    }
  };
  while(result.tokens[0].type !== Tokens.close_square) {
    const valueResult = parseValue(result.tokens);
    result.tokens = valueResult.tokens;
    result.node.value.push(valueResult.node);
    if(result.tokens[0].type === Tokens.comma) {
      result.tokens = result.tokens.slice(1);
    }
  }
  return {
    tokens: result.tokens.slice(1),
    node: result.node
  };
}
