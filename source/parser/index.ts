import { parseRoot, RootNode } from "./root";
import { Token, Tokens } from "../lexer";
import { ASTNode } from "./node";

export type ParseResult<T = ASTNode> = {
  node: T;
  tokens: Token[];
};

export type PotentialParseResult<T = ASTNode> = ParseResult<T> | undefined;

export type Parser<T = ASTNode> = (tokens: Token[]) => ParseResult<T>;

const tokenFilter: Tokens[] = [
  Tokens.single_line_comment,
  Tokens.multi_line_comment
];

export function parse(tokens: Token[]) {
  const filteredTokens = tokens.filter((token) => !tokenFilter.includes(token.kind));
  return parseRoot(filteredTokens).node;
}

export type AST = RootNode;

export {
  Kinds,
  ASTNode
} from "./node";
