import { BaseToken, Tokens } from "../";
import { getEnum } from "../../utils";
import { Context, nextContext } from "../context";

export interface CommentToken<T extends Tokens> extends BaseToken<T> {
  value: string;
}

export type CommentTokens = keyof typeof CommentTokens;

export const CommentTokens = getEnum({
  single_line_comment: true,
  multi_line_comment: true
});

type Matcher = {
  kind: CommentTokens;
  open: (file: string) => boolean;
  while: (file: string) => boolean;
};

const matchers: Matcher[] = [{
  kind: CommentTokens.single_line_comment,
  open: is("//"),
  while: isNot("\n")
}, {
  kind: CommentTokens.multi_line_comment,
  open: is("/*"),
  while: isNot("*/")
}];

function isNot(match: string) {
  return (file: string) => !is(match)(file);
}

function is(match: string) {
  return (file: string) => file.startsWith(match);
}

function getNextValueWhile(context: Context, matcher: Matcher) {
  let string = "";
  let pointer = 0;
  do { // First char has already been validated
    string += context.file[pointer];
    pointer += 1;
  } while(pointer < context.file.length && matcher.while(context.file[pointer]));
  return nextContext(context, matcher.kind, string, string);
}

export function getCommentToken(context: Context): Context {
  const match = matchers.find((matcher) => matcher.open(context.file));
  if(match) {
    return getNextValueWhile(context, match);
  } else {
    return context;
  }
}
