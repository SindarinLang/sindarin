import { Result } from "..";
import { getLocation, ReadValue } from "../reader";
import { getScanError, ScanPhase } from ".";
import { Tokens } from "./tokens";

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

export function getResult(context: ReadValue, kind: Tokens, raw: string, value?: string): Result<ScanPhase> {
  const lineSplit = raw.split("\n");
  const newLines = lineSplit.length - 1;
  return {
    context: {
      contents: context.contents.substring(raw.length),
      location: getLocation(
        context.location.path,
        context.location.line + newLines,
        (newLines > 0 ? 0 : context.location.char) + lineSplit[newLines].length
      )
    },
    value: [{
      kind,
      raw,
      value,
      location: context.location
    }],
    errors: []
  };
}

export function mergeResults(a: Result<ScanPhase>, b: Result<ScanPhase>) {
  if(a.value && b.value) {
    return {
      context: b.context,
      value: a.value.concat(b.value),
      errors: a.errors.concat(b.errors)
    };
  } else {
    return {
      context: b.context,
      value: undefined,
      errors: a.errors.concat(b.errors)
    };
  }
}
