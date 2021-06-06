import { getToken } from "..";
import { getScanError, ScanPhase } from "../..";
import { Result } from "../../..";
import { getEnum } from "../../../../../utils";
import { ReadValue } from "../../../reader";
import { mergeResults, getResult } from "../../result";

export type StringTokens = keyof typeof StringTokens;

const tokens = {
  open_quote: '"',
  close_quote: '"',
  open_template: "{",
  close_template: "}"
};

export const StringTokens = getEnum({
  ...tokens,
  string: true
});

const escapes = {
  "\\n": "\n",
  "\\t": "\t",
  "`": "\"",
  "\\\"": "\"",
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

function getTemplateTokens(file: ReadValue): Result<ScanPhase> {
  let result = getResult(file, StringTokens.open_template, tokens.open_template);
  let nestedLevel = 1;
  while(result.context.contents.length > 0 && nestedLevel > 0) {
    const token = getToken(result.context);
    if(token.value) {
      result = mergeResults(result, token);
      if(result.context.contents[0] === tokens.open_template) {
        nestedLevel += 1;
      } else if(result.context.contents[0] === tokens.close_template) {
        nestedLevel -=1;
      }
    } else {
      return token;
    }
  }
  if(result.context.contents[0] === tokens.close_template) {
    result = getResult(result.context, StringTokens.close_template, tokens.close_template);
    return mergeResults(result, getStringToken(result.context));
  } else {
    return result;
  }
}

function getStringToken(file: ReadValue): Result<ScanPhase> {
  let contents = file.contents;
  let raw = "";
  let value = "";
  while(contents.length > 0 && contents[0] !== tokens.close_quote && contents[0] !== tokens.open_template) {
    const result = getStringChar(contents);
    contents = contents.substring(result.raw.length);
    raw += result.raw;
    value += result.value;
  }
  const result = getResult(file, StringTokens.string, raw, value);
  if(result.context.contents[0] === tokens.close_quote) {
    return mergeResults(result, getResult(result.context, StringTokens.close_quote, tokens.close_quote));
  } else if(result.context.contents[0] === tokens.open_template) {
    return mergeResults(result, getTemplateTokens(result.context));
  } else {
    return {
      context: result.context,
      value: undefined,
      errors: [
        getScanError("Could not close string template", result.context.location)
      ]
    };
  }
}

export const getOpenQuoteToken: ScanPhase = (file: ReadValue) => {
  if(file.contents.startsWith(tokens.open_quote)) {
    const result = getResult(file, StringTokens.open_quote, tokens.open_quote);
    return mergeResults(result, getStringToken(result.context));
  } else {
    return {
      context: file,
      value: undefined,
      errors: [
        getScanError("No open quote", file.location)
      ]
    };
  }
};

