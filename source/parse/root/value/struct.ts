import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode } from "../../";
import { parseValue, ValueNode } from ".";
import { Kinds } from "../../node";

export interface StructNode extends ASTNode {
  kind: Kinds.struct;
  value: {
    [key: string]: ValueNode;
  };
}

export function parseStruct(tokens: Token[]): ParseResult<StructNode> {
  const result: ParseResult<StructNode> = {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.struct,
      value: {}
    }
  };
  while(result.tokens[0].type !== Tokens.close_curly) {
    if(result.tokens[0].type === Tokens.identifier && result.tokens[1]?.type === Tokens.colon) {
      const key = result.tokens[0].value;
      const valueResult = parseValue(result.tokens.slice(2));
      result.tokens = valueResult.tokens;
      result.node.value[key] = valueResult.node;
    } else {
      throw new Error("syntax error");
    }
    if(result.tokens[0].type === Tokens.comma) {
      result.tokens = result.tokens.slice(1);
    }
  }
  return {
    tokens: result.tokens.slice(1),
    node: result.node
  };
}
