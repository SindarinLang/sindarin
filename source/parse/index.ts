import { Token, Tokens } from "../lex";
import { TopLevelNode, getNode } from "./nodes";

export type ASTNode = {
  kind: string;
};

export interface AST extends ASTNode {
  kind: "root";
  nodes: TopLevelNode[];
}

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
};

export type Parser<T = ASTNode> = (tokens: Token[]) => ParseResult<T>;

const tokenFilter = [
  Tokens.space,
  Tokens.single_comment,
  Tokens.multi_comment
];

export function parse(source: Token[]) {
  const ast: AST = {
    kind: "root",
    nodes: []
  };
  let tokens = source.filter((token) => !tokenFilter.includes(token.type));
  while(tokens.length > 0) {
    const result = getNode(tokens);
    tokens = result.tokens ?? [];
    if(result.node) {
      ast.nodes.push(result.node);
    }
  }
  return ast;
}
