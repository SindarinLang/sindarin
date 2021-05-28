import { Token, Tokens } from "../../../../../lexer";
import { ParseResult, ASTNode, Kinds } from "../../../../..";

export interface PathNode extends ASTNode {
  kind: Kinds.path;
  value: string;
  path?: PathNode;
}

export function parsePath(tokens: Token[]): ParseResult<PathNode> {
  if(tokens[0].type === Tokens.dot && tokens[1]?.type === Tokens.identifier) {
    const result: ParseResult<PathNode> = {
      tokens: tokens.slice(2),
      node: {
        kind: Kinds.path,
        value: tokens[1].value
      }
    };
    if(result.tokens[0]?.type === Tokens.dot) {
      const pathResult = parsePath(result.tokens);
      result.tokens = pathResult.tokens;
      result.node.path = pathResult.node;
    }
    return result;
  } else if(tokens[0].type === Tokens.identifier) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.path,
        value: tokens[0].value
      }
    };
  } else {
    throw new Error("syntax error");
  }
}
