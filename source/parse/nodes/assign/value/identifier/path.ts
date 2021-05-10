import { Token, Tokens } from "../../../../../lex";
import { ParseResult, ASTNode } from "../../../..";

export const pathKind = "path";

export interface PathNode extends ASTNode {
  kind: typeof pathKind;
  value: string;
  path?: PathNode;
}

export function parsePath(tokens: Token[]): ParseResult<PathNode> {
  if(tokens[0].type === Tokens.dot && tokens[1]?.type === Tokens.identifier) {
    const result: ParseResult<PathNode> = {
      tokens: tokens.slice(2),
      node: {
        kind: pathKind,
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
        kind: pathKind,
        value: tokens[0].value
      }
    };
  } else {
    throw new Error("syntax error");
  }
}
