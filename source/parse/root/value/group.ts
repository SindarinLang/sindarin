import { Token, Tokens } from "../../../lex";
import { ParseResult, ASTNode, Kinds } from "../..";
import { parseValue, ValueNode } from ".";

export interface GroupNode extends ASTNode {
  kind: Kinds.group;
  value: ValueNode;
}

export function parseGroup(tokens: Token[]): ParseResult<GroupNode> {
  const result = parseValue(tokens.slice(1));
  if(result.tokens[0].type === Tokens.close_paren) {
    return {
      tokens: result.tokens.slice(1),
      node: {
        kind: Kinds.group,
        value: result.node
      }
    };
  } else {
    throw new Error("syntax error");
  }
}
