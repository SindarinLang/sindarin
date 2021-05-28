import { Token, Tokens } from "../../../../../lexer";
import { ParseResult, ASTNode, Kinds } from "../../../../..";
import { ArgumentsNode, parseArguments } from "./arguments";
import { parsePath, PathNode } from "./path";

export interface IdentifierNode extends ASTNode {
  kind: Kinds.identifier;
  value: string;
  call?: ArgumentsNode;
  path?: PathNode;
  // TODO: forward?: IdentifierNode;
  // TODO: backward?: IdentifierNode;
}

export interface CallNode extends IdentifierNode {
  call: ArgumentsNode;
}

export function parseIdentifier(tokens: Token[]): ParseResult<IdentifierNode> {
  const result: ParseResult<IdentifierNode> = {
    tokens: tokens.slice(1),
    node: {
      kind: Kinds.identifier,
      value: tokens[0].value,
      call: undefined,
      path: undefined
    }
  };
  if(result.tokens[0]?.type === Tokens.open_paren) {
    const argumentsResult = parseArguments(result.tokens);
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
