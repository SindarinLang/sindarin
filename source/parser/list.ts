import reduceFirst from "reduce-first";
import { Parser, ParseResult } from ".";
import { haveTokens, haveTokensIn, Token, Tokens } from "../lexer";
import { ASTNode, Kinds } from "./node";

export interface ListNode<T extends ASTNode> extends ASTNode {
  kind: Kinds.list;
  value: T[];
}

const endTokens = [
  Tokens.semi,
  Tokens.close_round,
  Tokens.close_square,
  Tokens.close_curly
];

export function parseCommaList<T extends ASTNode>(
  tokens: Token[],
  parsers: Parser<T>[]
): ParseResult<ListNode<T>> {
  return parseList(tokens, parsers, Tokens.comma);
}

export function parseSemiList<T extends ASTNode>(
  tokens: Token[],
  parsers: Parser<T>[]
): ParseResult<ListNode<T>> {
  return parseList(tokens, parsers, Tokens.semi);
}

const getEmptyList = <T extends ASTNode>(tokens: Token[]): ParseResult<ListNode<T>> => ({
  tokens,
  node: {
    kind: Kinds.list,
    value: []
  }
});

export function parseList<T extends ASTNode>(
  tokens: Token[],
  parsers: Parser<T>[],
  separator: Tokens
): ParseResult<ListNode<T>> {
  if(tokens.length === 0) {
    return getEmptyList(tokens);
  } else {
    const result = reduceFirst(parsers, (parser) => {
      return parser(tokens);
    });
    if(result) {
      if(haveTokens(result.tokens, separator) && (!haveTokensIn(result.tokens, endTokens) || !haveTokensIn(result.tokens.slice(1), endTokens))) {
        const nextResult = parseList(result.tokens.slice(1), parsers, separator);
        if(nextResult) {
          return {
            tokens: nextResult.tokens,
            node: {
              kind: nextResult.node.kind,
              value: [result.node].concat(nextResult.node.value)
            }
          };
        } else {
          return undefined;
        }
      } else if(haveTokensIn(result.tokens, endTokens)) {
        return {
          tokens: result.tokens,
          node: {
            kind: Kinds.list,
            value: [result.node]
          }
        };
      } else {
        return undefined;
      }
    } else if(haveTokensIn(tokens, endTokens)) {
      return getEmptyList(tokens);
    } else {
      return undefined;
    }
  }
}
