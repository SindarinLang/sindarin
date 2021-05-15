import { parseRoot, RootNode } from "./root";
import { Token, Tokens } from "../lex";
import { ASTNode } from "./node";

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

export function parse(tokens: Token[]) {
  const filteredTokens = tokens.filter((token) => !tokenFilter.includes(token.type));
  return parseRoot(filteredTokens).node;
}

export type AST = RootNode;

export {
  Kinds,
  ASTNode
} from "./node";
