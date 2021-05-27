import { Token } from ".";
import { getLocation, TokenLocation } from "./location";
import { Tokens } from "./tokens";

export type Context = {
  file: string;
  tokens: Token[];
  location: TokenLocation;
};

export function hasChanged(since: Context, context: Context) {
  return context.tokens.length !== since.tokens.length;
}

export function nextContext(context: Context, kind: Tokens, raw: string, value?: string): Context {
  if(value !== "") {
    const lineSplit = raw.split("\n");
    const newLines = lineSplit.length - 1;
    return {
      file: context.file.substring(raw.length),
      tokens: context.tokens.concat({
        kind,
        raw,
        value,
        location: context.location
      }),
      location: getLocation({
        path: context.location.path,
        line: context.location.line + newLines,
        char: (newLines > 0 ? 0 : context.location.char) + lineSplit[newLines].length
      })
    };
  } else {
    return context;
  }
}
