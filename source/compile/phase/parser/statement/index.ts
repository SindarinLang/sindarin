import { Token } from "../../scanner";
import { Parser, ParseResult } from "..";
import { AssignmentNode, parseAssign } from "./assignment";
import { TupleNode, parseTuple } from "./tuple";
import { ReturnNode, parseReturn } from "./return";
import {
  parseFrom,
  parseImport,
  parseExport,
  ImportNode,
  ExportNode
} from "./modules";
import { ListNode, parseSemiList } from "../list";

export type StatementNode =
  | ImportNode
  | ExportNode
  | ReturnNode
  | AssignmentNode
  | TupleNode;

const parsers: Parser<StatementNode>[] = [
  parseFrom,
  parseImport,
  parseExport,
  parseReturn,
  parseAssign,
  parseTuple
];

export function parseStatements(tokens: Token[]): ParseResult<ListNode<StatementNode>> {
  const listResult = parseSemiList(tokens, parsers);
  if(listResult) {
    return listResult;
  } else {
    throw new Error("Syntax error");
  }
}
