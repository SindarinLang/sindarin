import { readFile } from "read-file-safe";
import { Context } from "./context";
import { getLocation, TokenLocation } from "./location";
import { getToken, Tokens } from "./tokens";
import { ValueToken, ValueTokens } from "./tokens/value";

export type BaseToken<T extends Tokens> = {
  kind: T;
  raw: string;
  location: TokenLocation;
};

export type Token<T extends Tokens = Tokens> = T extends ValueTokens ? ValueToken<T> : BaseToken<T>;

export function isToken<T extends Tokens>(token: Token, kind: T): token is Token<T> {
  return token.kind === kind;
}

export function isTokenIn<T extends Tokens>(token: Token, kind: T[]): token is Token<T> {
  return (kind as string[]).includes(token.kind);
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

export async function lex(path: string) {
  const file = await readFile(path) as string;
  let context: Context = {
    file,
    tokens: [],
    location: getLocation({
      path,
      line: 1,
      char: 0
    })
  };
  while(context.file.length > 0) {
    context = getToken(context);
  }
  console.log(context.tokens);
  return [];
  // return context.tokens;
}

export {
  Tokens
};
