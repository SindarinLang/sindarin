import { getToken } from "..";
import { getEnum } from "../../../../../utils";
import { Context, nextContext } from "../../context";

const tokens = {
  open_quote: '"',
  close_quote: '"',
  open_template: "{",
  close_template: "}"
};

export type StringTokens = keyof typeof StringTokens;

export const StringTokens = getEnum({
  ...tokens,
  string: true
});

const escapes = {
  "\\n": "\n",
  "\\t": "\t",
  "`": "\"",
  "\\`": "`",
  "\\{": "{",
  "\\\\": "\\"
};

function getStringChar(file: string) {
  const match = (Object.keys(escapes) as (keyof typeof escapes)[]).find((key) => file.startsWith(key));
  if(match) {
    return {
      raw: file.substring(0, match.length),
      value: escapes[match]
    };
  } else {
    return {
      raw: file[0],
      value: file[0]
    };
  }
}

function getTemplateTokens(context: Context): Context | undefined {
  let templateContext = nextContext(context, StringTokens.open_template, tokens.open_template);
  let nestedLevel = 1;
  while(templateContext.file.contents.length > 0 && nestedLevel > 0) {
    const token = getToken(templateContext);
    if(token) {
      templateContext = token;
      if(templateContext.file.contents[0] === tokens.open_template) {
        nestedLevel += 1;
      } else if(templateContext.file.contents[0] === tokens.close_template) {
        nestedLevel -=1;
      }
    } else {
      return undefined;
    }
  }
  if(templateContext.file.contents[0] === tokens.close_template) {
    templateContext = nextContext(templateContext, StringTokens.close_template, tokens.close_template);
    return getStringToken(templateContext);
  } else {
    return templateContext;
  }
}

function getStringToken(context: Context): Context | undefined {
  let contents = context.file.contents;
  let raw = "";
  let value = "";
  while(contents.length > 0 && contents[0] !== tokens.close_quote && contents[0] !== tokens.open_template) {
    const result = getStringChar(contents);
    contents = contents.substring(result.raw.length);
    raw += result.raw;
    value += result.value;
  }
  const stringContext = nextContext(context, StringTokens.string, raw, value);
  if(stringContext.file.contents[0] === tokens.close_quote) {
    return nextContext(stringContext, StringTokens.close_quote, tokens.close_quote);
  } else if(stringContext.file.contents[0] === tokens.open_template) {
    return getTemplateTokens(stringContext);
  } else {
    return stringContext;
  }
}

export function getOpenQuoteToken(context: Context) {
  if(context.file.contents.startsWith(tokens.open_quote)) {
    const openContext = nextContext(context, StringTokens.open_quote, tokens.open_quote);
    return getStringToken(openContext);
  } else {
    return context;
  }
}

