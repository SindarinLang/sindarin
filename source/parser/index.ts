import { parseRoot, RootNode } from "./root";
import { Token, Tokens } from "../lexer";
import { ASTNode } from "./node";

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
};

export type PotentialParseResult<T = ASTNode> = ParseResult<T> | undefined;

export type Parser<T = ASTNode> = (tokens: Token[]) => PotentialParseResult<T>;

export type ParserNodes<T extends Array<(tokens: Token[]) => PotentialParseResult<ASTNode>>> = NonNullable<ReturnType<T[number]>>["node"];

const tokenFilter: Tokens[] = [
  Tokens.single_line_comment,
  Tokens.multi_line_comment,
  Tokens.space,
  Tokens.newline
];

export type AST = RootNode;

export function parse(tokens: Token[]): AST {
  const filteredTokens = tokens.filter((token) => !tokenFilter.includes(token.kind));
  return parseRoot(filteredTokens).node;
}
