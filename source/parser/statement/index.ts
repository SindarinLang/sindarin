import reduceFirst from "reduce-first";
import { haveTokens, Token, Tokens } from "../../lexer";
import { ParseResult } from "..";
import { AssignNode, parseAssign } from "./assign";
import { TupleNode, parseTuple } from "./tuple";
import { ReturnNode, parseReturn } from "./return";
import {
  parseFrom,
  parseImport,
  parseExport,
  ImportNode,
  ExportNode
} from "./modules";


export type StatementNode =
  | ImportNode
  | ExportNode
  | ReturnNode
  | AssignNode
  | TupleNode;

const parsers = [
  parseFrom,
  parseImport,
  parseExport,
  parseReturn,
  parseAssign,
  parseTuple
];

export function parseStatement(tokens: Token[]): ParseResult<StatementNode> {
  const result = reduceFirst(parsers, (parser) => {
    return parser(tokens);
  });
  if(result && haveTokens(result.tokens, Tokens.semi)) {
    return {
      ...result,
      tokens: result.tokens.slice(1)
    };
  } else {
    throw new Error("Missing semi-colon");
  }
}
