import reduceFirst from "reduce-first";
import { FileLocation } from "../../reader";
import { Context, hasChanged } from "../context";
import { CommentTokens, getCommentToken } from "./comment";
import { getRawToken, RawTokens } from "./raw";
import { getValueToken, ValueToken, ValueTokens } from "./value";

export type Tokens =
  | CommentTokens
  | RawTokens
  | ValueTokens;

export const Tokens = {
  ...CommentTokens,
  ...RawTokens,
  ...ValueTokens
};

export type BaseToken<T extends Tokens> = {
  kind: T;
  raw: string;
  location: FileLocation;
};

export type Token<T extends Tokens = Tokens> = T extends ValueTokens ? ValueToken<T> : BaseToken<T>;

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

export function getToken(context: Context): Context | undefined {
  const strategies = [
    getCommentToken,
    getRawToken,
    getValueToken
  ];
  return reduceFirst(strategies, (strategy) => {
    const nextContext = strategy(context);
    return hasChanged(context, nextContext) ? nextContext : undefined;
  });
}
