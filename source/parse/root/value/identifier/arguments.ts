import { Token, Tokens } from "../../../../lex";
import { ParseResult, ASTNode } from "../../../";
import { parseValue, ValueNode } from "..";
import { parseVoid } from "../void";
import { Kinds } from "../../../node";

export interface ArgumentsNode extends ASTNode {
  kind: Kinds.arguments;
  value: ValueNode[];
}

export function parseArguments(tokens: Token[]): ParseResult<ArgumentsNode> {
  const result: ParseResult<ArgumentsNode> = {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.arguments,
      value: []
    }
  };
  while(result.tokens[0].type !== Tokens.close_paren) {
    if(result.tokens[0].type === Tokens.comma) {
      const voidResult = parseVoid(result.tokens);
      result.tokens = voidResult.tokens;
      result.node.value.push(voidResult.node);
    } else {
      const valueResult = parseValue(result.tokens);
      result.tokens = valueResult.tokens;
      result.node.value.push(valueResult.node);
      if(result.tokens[0]?.type === Tokens.comma) {
        if(result.tokens[1]?.type === Tokens.close_paren || result.tokens[1]?.type === Tokens.comma) {
          const voidResult = parseVoid(result.tokens);
          result.tokens = voidResult.tokens;
          result.node.value.push(voidResult.node);
        } else {
          result.tokens = result.tokens.slice(1);
        }
      }
    }
  }
  return {
    tokens: result.tokens.slice(result.tokens[1].type === Tokens.semi ? 2 : 1),
    node: result.node
  };
}
