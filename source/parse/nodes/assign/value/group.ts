import { Token, Tokens } from "../../../../lex";
import { ParseResult, ASTNode } from "../../..";
import { parseValue, ValueNode } from ".";

export const groupKind = "group";

export interface GroupNode extends ASTNode {
  kind: typeof groupKind;
  value: ValueNode;
}

export function parseGroup(tokens: Token[]): ParseResult<GroupNode> {
  const result = parseValue(tokens.slice(1));
  if(result.tokens[0].type === Tokens.close_paren) {
    return {
      tokens: result.tokens.slice(1),
      node: {
        kind: groupKind,
        value: result.node
      }
    };
  } else {
    throw new Error("syntax error");
  }
}
