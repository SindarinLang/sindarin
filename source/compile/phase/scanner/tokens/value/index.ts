import { BaseToken } from "..";
import { Tokens } from "../..";
import { getEnum } from "../../../../../utils";
import { Context, nextContext } from "../../context";
import { getOpenQuoteToken, StringTokens } from "./string";

export interface ValueToken<T extends Tokens> extends BaseToken<T> {
  value: string;
}

export type ValueTokens = keyof typeof ValueTokens;

export const ValueTokens = getEnum({
  ...StringTokens,
  identifier: true,
  type: true,
  number: true
});

type Matcher = {
  kind: ValueTokens;
  open: (file: string) => boolean;
  while: (file: string) => boolean;
};

const matchers: Matcher[] = [{
  kind: ValueTokens.type,
  open: isUpper,
  while: isAlphaNumeric
}, {
  kind: ValueTokens.identifier,
  open: isLower,
  while: isAlphaNumeric
}, {
  kind: ValueTokens.number,
  open: isNumeric,
  while: isNumeric
}];

function isBetween(char: string, left: string, right: string) {
  const code = char.charCodeAt(0);
  return code >= left.charCodeAt(0) && code <= right.charCodeAt(0);
}

function isUpper(char: string) {
  return isBetween(char, "A", "Z");
}

function isLower(char: string) {
  return isBetween(char, "a", "z");
}

function isNumeric(char: string) {
  return isBetween(char, "0", "9");
}

function isAlpha(char: string) {
  return isUpper(char) || isLower(char);
}

function isAlphaNumeric(char: string) {
  return isAlpha(char) || isNumeric(char);
}

function getNextValueWhile(context: Context, matcher: Matcher) {
  let string = "";
  let pointer = 0;
  do { // First char has already been validated
    string += context.file.contents[pointer];
    pointer += 1;
  } while(pointer < context.file.contents.length && matcher.while(context.file.contents[pointer]));
  return nextContext(context, matcher.kind, string, string);
}

export function getValueToken(context: Context): Context {
  const match = matchers.find((matcher) => matcher.open(context.file.contents));
  if(match) {
    return getNextValueWhile(context, match);
  } else {
    return getOpenQuoteToken(context);
  }
}
