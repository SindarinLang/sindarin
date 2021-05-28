import reduceFirst from "reduce-first";
import { Token } from "../../lexer";
import { ParseResult } from "..";
import { AssignNode, parseAssign } from "./assign";
import { ASTNode, Kinds } from "../node";
import {
  parseFrom,
  parseImport,
  parseExport,
  ImportNode,
  ExportNode
} from "./modules";


export type TopLevelNode =
  | ImportNode
  | ExportNode
  | AssignNode
  | ExpressionNode;

export interface RootNode extends ASTNode {
  kind: Kinds.root;
  nodes: TopLevelNode[];
}

const parsers = [
  parseFrom,
  parseImport,
  parseExport,
  parseAssign,
  parseExpression
];

export function parseRoot(tokens: Token[]): ParseResult<RootNode> {
  const result: ParseResult<RootNode> = {
    tokens,
    node: {
      kind: Kinds.root,
      nodes: []
    }
  };
  while(result.tokens.length > 0) {
    const nodeResult = reduceFirst(parsers, (parser) => {
      return parser(result.tokens);
    });
    if(nodeResult) {
      result.tokens = nodeResult.tokens;
      result.node.nodes.push(nodeResult.node);
    } else {
      throw new Error(`Invalid token ${tokens[0].location}`);
    }
  }
  return result;
}
