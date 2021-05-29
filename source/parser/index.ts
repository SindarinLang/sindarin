import { StatementNode, parseStatement } from "./statement";
import { Token, Tokens } from "../lexer";
import { ASTNode, Kinds } from "./node";

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
} | undefined;

export type Parser<T = ASTNode> = (tokens: Token[]) => ParseResult<T>;

export type ParserNodes<T extends Array<
  (tokens: Token[]) => ParseResult<ASTNode>
>> = NonNullable<ReturnType<T[number]>>["node"];

const tokenFilter: Tokens[] = [
  Tokens.single_line_comment,
  Tokens.multi_line_comment,
  Tokens.space,
  Tokens.newline
];

export type AST = RootNode;

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  nodes: StatementNode[];
}

export function parse(tokens: Token[]): AST {
  const result: ParseResult<RootNode> = {
    tokens: tokens.filter((token) => !tokenFilter.includes(token.kind)),
    node: {
      kind: Kinds.root,
      nodes: []
    }
  };
  while(result.tokens.length > 0) {
    const statementResult = parseStatement(result.tokens);
    if(statementResult) {
      result.tokens = statementResult.tokens;
      result.node.nodes.push(statementResult.node);
    } else {
      throw new Error("Could not parse statement");
    }
  }
  return result.node;
}
