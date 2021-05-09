import { Token, Tokens } from "../../lex";
import { ParseResult } from "../";
import {
  ImportNode,
  ExportNode,
  parseFrom,
  parseImport,
  parseExport
} from "./modules";
import { AssignNode, parseAssign } from "./assign";

type InvalidNode = {
  kind: "invalid";
  value: string;
};

export type TopLevelNode =
  | ImportNode
  | ExportNode
  | AssignNode
  | InvalidNode;
  // CallNode

export function getNode(tokens: Token[]): ParseResult<TopLevelNode> {
  if(tokens[0].type === Tokens.from) {
    return parseFrom(tokens);
  } else if(tokens[0].type === Tokens.import) {
    return parseImport(tokens);
  } else if(tokens[0].type === Tokens.export) {
    return parseExport(tokens);
  } else if(tokens[0].type === Tokens.identifier && tokens[1].type === Tokens.assign) {
    return parseAssign(tokens);
  } else {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: "invalid",
        value: tokens[0].value
      }
    };
  }
}
