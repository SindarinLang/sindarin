import reduceFirst from "reduce-first";
import { ScanPhase } from "..";
import { Result } from "../..";
import { FileLocation, ReadValue } from "../../reader";
import { CommentTokens, getCommentToken } from "./comment";
import { getRawToken, RawTokens } from "./raw";
import { getValueToken, ValueTokens } from "./value";
import { getOpenQuoteToken, StringTokens } from "./string";
import { getRuneToken, RuneTokens } from "./rune";

export type Tokens =
  | CommentTokens
  | RawTokens
  | ValueTokens
  | StringTokens
  | RuneTokens;

export type Token<T extends Tokens = Tokens> = {
  kind: T;
  raw: string;
  value?: string;
  location: FileLocation;
};

export const Tokens = {
  ...CommentTokens,
  ...RawTokens,
  ...ValueTokens,
  ...StringTokens,
  ...RuneTokens
};

export function isToken<T extends Tokens>(token: Token | undefined, kind: T): token is Token<T> {
  return token?.kind === kind;
}

export function isTokenIn<T extends Tokens>(token: Token | undefined, kind: T[]): token is Token<T> {
  return token !== undefined && (kind as string[]).includes(token.kind);
}

export function haveTokens<T extends Tokens[]>(tokens: Token[], ...kinds: T): tokens is NonNullable<{
  [Key in keyof T]: T[Key] extends Tokens ? Token<T[Key]> : never;
}> {
  return Boolean(kinds.reduce((retval, kind, index) => {
    return retval && isToken(tokens[index], kind);
  }, true));
}

export function haveTokensIn<T extends Tokens[]>(tokens: Token[], ...kinds: T[]): tokens is NonNullable<{
  [Key in keyof T]: T[Key] extends Tokens ? Token<T[Key]> : never;
}> {
  return Boolean(kinds.reduce((retval, kind, index) => {
    return retval && isTokenIn(tokens[index], kind);
  }, true));
}

export function getToken(context: ReadValue): Result<ScanPhase> {
  const strategies = [
    getCommentToken,
    getRawToken,
    getValueToken,
    getOpenQuoteToken,
    getRuneToken
  ];
  const errorResult: Result<ScanPhase> = {
    context,
    value: undefined,
    errors: []
  };
  return reduceFirst(strategies, (strategy) => {
    const result = strategy(context);
    errorResult.errors.push(...result.errors);
    return result.value ? result : undefined;
  }) ?? errorResult;
}
