import { Token, Tokens } from "../../../../../lex";
import { ParseResult, ASTNode } from "../../../..";
import { ArgumentsNode, parseArguments } from "./arguments";
import { parsePath, PathNode } from "./path";

export const identifierKind = "identifier";

export interface IdentifierNode extends ASTNode {
  kind: typeof identifierKind;
  value: string;
  call?: ArgumentsNode;
  path?: PathNode;
  // TODO: forward?: IdentifierNode;
  // TODO: backward?: IdentifierNode;
}

export function parseIdentifier(tokens: Token[]): ParseResult<IdentifierNode> {
  const result: ParseResult<IdentifierNode> = {
    tokens: tokens.slice(1),
    node: {
      kind: identifierKind,
      value: tokens[0].value,
      call: undefined,
      path: undefined
    }
  };
  if(result.tokens[0]?.type === Tokens.open_paren) {
    const argumentsResult = parseArguments(tokens.slice(1));
    result.tokens = argumentsResult.tokens;
    result.node.call = argumentsResult.node;
  }
  if(result.tokens[0]?.type === Tokens.dot) {
    const pathResult = parsePath(result.tokens);
    result.tokens = pathResult.tokens;
    result.node.path = pathResult.node;
  }
  return result;
}
