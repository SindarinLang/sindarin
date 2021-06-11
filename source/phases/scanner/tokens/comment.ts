import { ScanPhase } from "..";
import { Result } from "../..";
import { getEnum } from "../../../utils";
import { ReadValue } from "../../reader";
import { TokenMatchers, getMatch } from "../result";

export type CommentTokens = keyof typeof CommentTokens;

export const CommentTokens = getEnum({
  single_line_comment: true,
  multi_line_comment: true
});

const matchers: TokenMatchers<CommentTokens> = [{
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

export function getCommentToken(context: ReadValue): Result<ScanPhase> {
  return getMatch(context, matchers);
}
