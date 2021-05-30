import reduceFirst from "reduce-first";
import { Parser, ParseResult } from ".";
import { haveTokens, haveTokensIn, Token, Tokens } from "../lexer";
import { ASTNode, Kinds } from "./node";

export interface ListNode<T extends ASTNode> extends ASTNode {
  kind: Kinds.list;
  value: T[];
}

const endTokens: Tokens[] = [
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
  separator: Tokens,
  hardStop = true
): ParseResult<ListNode<T>> {
  if(tokens.length === 0 || (haveTokensIn(tokens, endTokens) && hardStop)) {
    return getEmptyList(tokens);
  } else {
    const result = reduceFirst(parsers, (parser) => {
      return parser(tokens);
    });
    if(result) {
      if(haveTokens(result.tokens, separator)) {
        const nextResult = parseList(result.tokens.slice(1), parsers, separator, endTokens.includes(separator));
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
    } else {
      return undefined;
    }
  }
}
