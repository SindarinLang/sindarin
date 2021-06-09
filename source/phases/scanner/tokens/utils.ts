import { Tokens } from ".";
import { getScanError } from "..";
import { ReadValue } from "../../reader";
import { getResult } from "../result";

type TokenMatcher<T extends Tokens> = {
  kind: T;
  open: (file: string) => boolean;
  while: (file: string) => boolean;
};

export type TokenMatchers<T extends Tokens> = TokenMatcher<T>[];

function matchToken<T extends Tokens>(file: ReadValue, matchers: TokenMatchers<T>) {
  return matchers.find((matcher) => matcher.open(file.contents));
}

function getNextValueWhile<T extends Tokens>(file: ReadValue, matcher: TokenMatcher<T>) {
  let string = "";
  let pointer = 0;
  do { // First char has already been validated
    string += file.contents[pointer];
    pointer += 1;
  } while(pointer < file.contents.length && matcher.while(file.contents[pointer]));
  return getResult(file, matcher.kind, string, string);
}

export function getMatch<T extends Tokens>(context: ReadValue, matchers: TokenMatchers<T>) {
  const match = matchToken(context, matchers);
  if(match) {
    return getNextValueWhile(context, match);
  } else {
    return {
      context,
      value: undefined,
      errors: [
        getScanError("Could not match", context.location)
      ]
    };
  }
}
