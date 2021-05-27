import { AssignNode } from "./root/assign";
import { ImportNode } from "./root/modules";
import { BooleanNode } from "./root/value/boolean";
import { CallNode, IdentifierNode } from "./root/value/identifier";
import { FloatNode, IntegerNode } from "./root/value/number";
import { OperatorNode } from "./root/value/operator";

export enum Kinds {
  root,
  import,
  export,
  from,
  module,
  assign,
  type,
  integer,
  float,
  string,
  boolean,
  undefined,
  operator,
  group,
  identifier,
  array,
  struct,
  function,
  void,
  arguments,
  path,
  invalid,
  parameter,
  return
}

export type ASTNode = {
  kind: Kinds;
};

export type NumericNode = IntegerNode | FloatNode;

export function isImportNode(node: ASTNode): node is ImportNode {
  return node.kind === Kinds.import;
}

export function isAssignNode(node: ASTNode): node is AssignNode {
  return node.kind === Kinds.assign;
}

export function isIdentifierNode(node: ASTNode): node is IdentifierNode {
  return node.kind === Kinds.identifier;
}

export function isCallNode(node: ASTNode): node is CallNode {
  return isIdentifierNode(node) && node.call !== undefined;
}

export function isFloatNode(node: ASTNode): node is FloatNode {
  return node.kind === Kinds.float;
}

export function isIntegerNode(node: ASTNode): node is IntegerNode {
  return node.kind === Kinds.integer;
}

export function isBooleanNode(node: ASTNode): node is BooleanNode {
  return node.kind === Kinds.boolean;
}

export function isOperatorNode(node: ASTNode): node is OperatorNode {
  return node.kind === Kinds.operator;
}

export function isNumeric(node: ASTNode): node is NumericNode {
  return isIntegerNode(node) || isFloatNode(node);
}
