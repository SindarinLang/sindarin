import { File, getLocation } from "../reader";
import { Token, Tokens } from "./tokens";

export type Context = {
  file: File;
  tokens: Token[];
};

export function hasChanged(since: Context, context: Context) {
  return context.tokens.length !== since.tokens.length;
}

export function haveContent(context?: Context) {
  return (context?.file.contents.length ?? 0) > 0;
}

export function nextContext(context: Context, kind: Tokens, raw: string, value?: string): Context {
  if(value !== "") {
    const lineSplit = raw.split("\n");
    const newLines = lineSplit.length - 1;
    return {
      file: {
        contents: context.file.contents.substring(raw.length),
        location: getLocation(
          context.file.location.path,
          context.file.location.line + newLines,
          (newLines > 0 ? 0 : context.file.location.char) + lineSplit[newLines].length
        )
      },
      tokens: context.tokens.concat({
        kind,
        raw,
        value,
        location: context.file.location
      } as Token)
    };
  } else {
    return context;
  }
}
