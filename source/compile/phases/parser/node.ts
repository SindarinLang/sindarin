import { ExpressionNode, TupletNode } from "./statement/tuple";
import { BinaryOperationNode } from "./statement/tuple/binary-operation";
import { UnaryOperationNode } from "./statement/tuple/unary-operation";
import { NullNode } from "./statement/tuple/value/null";
import { NumberNode } from "./statement/tuple/value/number";
import { AccessorNode } from "./statement/tuple/value/operation/accessor";
import { CallNode } from "./statement/tuple/value/operation/call";
import { VoidNode } from "./statement/tuple/void";

export enum Kinds {
  root = "root",
  import = "import",
  export = "export",
  from = "from",
  module = "module",
  number = "number",
  string = "string",
  boolean = "boolean",
  null = "null",
  tuple = "tuple",
  array = "array",
  struct = "struct",
  function = "function",
  void = "void",
  identifier = "identifier",
  type = "type",
  unaryOperation = "unaryOperation",
  binaryOperation = "binaryOperation",
  call = "call",
  accessor = "accessor",
  arguments = "arguments",
  parameters = "parameters",
  declaration = "declaration",
  assignment = "assignment",
  return = "return",
  spread = "spread",
  list = "list"
}

export type ASTNode<K extends Kinds = Kinds> = {
  kind: K;
};

export function isNode<K extends Kinds>(node: ASTNode | undefined, kind: K): node is ASTNode<K> {
  return node?.kind === kind;
}

export {
  NullNode,
  NumberNode,
  ExpressionNode,
  VoidNode,
  TupletNode,
  AccessorNode,
  BinaryOperationNode,
  UnaryOperationNode,
  CallNode
};
