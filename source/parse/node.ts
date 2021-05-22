import { AssignNode } from "./root/assign";
import { ImportNode } from "./root/modules";
import { BooleanNode } from "./root/value/boolean";
import { IdentifierNode } from "./root/value/identifier";
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

export function isIdentifier(node: ASTNode): node is IdentifierNode {
  return node.kind === Kinds.identifier;
}

export function isFloat(node: ASTNode): node is FloatNode {
  return node.kind === Kinds.float;
}

export function isInteger(node: ASTNode): node is IntegerNode {
  return node.kind === Kinds.integer;
}

export function isBoolean(node: ASTNode): node is BooleanNode {
  return node.kind === Kinds.boolean;
}

export function isOperator(node: ASTNode): node is OperatorNode {
  return node.kind === Kinds.operator;
}

export function isNumeric(node: ASTNode): node is NumericNode {
  return isInteger(node) || isFloat(node);
}
