import { Token, Tokens } from "../../lex";
import { ParseResult } from "../";
import {
  ImportNode,
  ExportNode,
  parseFrom,
  parseImport,
  parseExport
} from "./modules";
import { AssignNode, parseAssign } from "./assign";
import { parseInvalid, InvalidNode } from "./invalid";
import { ASTNode, Kinds } from "../node";
import { IdentifierNode, parseIdentifier } from "./value/identifier";

export type TopLevelNode =
  | ImportNode
  | ExportNode
  | AssignNode
  | IdentifierNode
  | InvalidNode;

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  nodes: TopLevelNode[];
}

export function parseTopLevel(tokens: Token[]): ParseResult<TopLevelNode> {
  if(tokens[0].type === Tokens.from) {
    return parseFrom(tokens);
  } else if(tokens[0].type === Tokens.import) {
    return parseImport(tokens);
  } else if(tokens[0].type === Tokens.export) {
    return parseExport(tokens);
  } else if(tokens[0].type === Tokens.identifier && tokens[1].type === Tokens.assign) {
    return parseAssign(tokens);
  } else if(tokens[0].type === Tokens.identifier && tokens[1].type === Tokens.open_paren) {
    return parseIdentifier(tokens);
  } else {
    return parseInvalid(tokens);
  }
}

export function parseRoot(tokens: Token[]): ParseResult<RootNode> {
  const result: ParseResult<RootNode> = {
    tokens,
    node: {
      kind: Kinds.root,
      nodes: []
    }
  };
  while(result.tokens.length > 0) {
    const nodeResult = parseTopLevel(result.tokens);
    result.tokens = nodeResult.tokens;
    result.node.nodes.push(nodeResult.node);
  }
  return result;
}
