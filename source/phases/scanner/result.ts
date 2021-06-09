import { Result } from "..";
import { getLocation, ReadValue } from "../reader";
import { ScanPhase } from ".";
import { Tokens } from "./tokens";

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
