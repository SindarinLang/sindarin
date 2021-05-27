import reduceFirst from "reduce-first";
import { Token, Tokens } from "../../lexer";
import { ParseResult } from "..";
import {
  ImportNode,
  ExportNode,
  parseFrom,
  parseImport,
  parseExport
} from "./modules";
import { AssignNode, parseAssign } from "./assign";
import { ASTNode, Kinds } from "../node";
import { IdentifierNode, parseIdentifier } from "./value/identifier";

export type TopLevelNode =
  | ImportNode
  | ExportNode
  | AssignNode
  | IdentifierNode;

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  nodes: TopLevelNode[];
}

export function parseTopLevel(tokens: Token[]): ParseResult<TopLevelNode> {
  if(tokens[0].kind === Tokens.from) {
    return parseFrom(tokens);
  } else if(tokens[0].kind === Tokens.import) {
    return parseImport(tokens);
  } else if(tokens[0].kind === Tokens.export) {
    return parseExport(tokens);
  } else if(tokens[0].kind === Tokens.identifier && tokens[1].kind === Tokens.assign) {
    return parseAssign(tokens);
  } else if(tokens[0].kind === Tokens.identifier && tokens[1].kind === Tokens.open_round) {
    return parseIdentifier(tokens);
  } else {
    throw new Error(`Invalid token ${tokens[0].location}`);
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
  const topLevelParsers = [
    parseFrom,
    parseImport,
    parseExport,
    parseAssign,
    parseIdentifier
  ];
  while(result.tokens.length > 0) {
    const nodeResult = reduceFirst(topLevelParsers, (parser) => {
      return parser(result.tokens);
    });
    if(nodeResult) {
      result.tokens = nodeResult.tokens;
      result.node.nodes.push(nodeResult.node);
    } else {
      throw new Error(`Invalid token ${tokens[0].location}`);
    }
  }
  return result;
}
