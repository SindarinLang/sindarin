import { haveTokens, haveTokensIn, Token, Tokens } from "../scanner";
import { getParseError, ParsePhase, ParseResult } from ".";
import { ASTNode, Kinds } from "./node";
import { getResultFrom } from "./result";

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
  parsers: ParsePhase<T>[]
): ParseResult<ListNode<T>> {
  return parseList(tokens, parsers, Tokens.comma);
}

export function parseSemiList<T extends ASTNode>(
  tokens: Token[],
  parsers: ParsePhase<T>[]
): ParseResult<ListNode<T>> {
  return parseList(tokens, parsers, Tokens.semi);
}

export function parseList<T extends ASTNode>(
  tokens: Token[],
  parsers: ParsePhase<T>[],
  separator: Tokens,
  hardStop = true
): ParseResult<ListNode<T>> {
  if(tokens.length === 0 || (haveTokensIn(tokens, endTokens) && hardStop)) {
    return {
      context: tokens,
      value: {
        kind: Kinds.list,
        value: []
      },
      errors: []
    };
  } else {
    const result = getResultFrom(tokens, parsers);
    if(result.value) {
      if(haveTokens(result.context, separator)) {
        const nextResult = parseList(result.context.slice(1), parsers, separator, endTokens.includes(separator));
        if(nextResult && nextResult.value) {
          return {
            context: nextResult.context,
            value: {
              kind: nextResult.value.kind,
              value: [result.value].concat(nextResult.value.value)
            },
            errors: []
          };
        } else {
          return {
            context: nextResult.context,
            value: undefined,
            errors: [
              getParseError(Kinds.list, tokens[0].location),
              ...nextResult.errors
            ]
          };
        }
      } else if(haveTokensIn(result.context, endTokens)) {
        return {
          context: result.context,
          value: {
            kind: Kinds.list,
            value: [result.value]
          },
          errors: []
        };
      } else {
        return {
          context: result.context,
          value: undefined,
          errors: [
            getParseError(Kinds.list, tokens[0].location),
            ...result.errors
          ]
        };
      }
    } else {
      return {
        context: result.context,
        value: undefined,
        errors: [
          getParseError(Kinds.list, tokens[0].location),
          ...result.errors
        ]
      };
    }
  }
}
