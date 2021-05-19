import { AssignNode } from "./root/assign";
import { ImportNode } from "./root/modules";
import { ExpressionNode } from "./root/value/expression";
import { IdentifierNode } from "./root/value/identifier";
import { FloatNode, IntegerNode } from "./root/value/number";

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
  expression,
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

export function isExpression(node: ASTNode): node is ExpressionNode {
  return node.kind === Kinds.expression;
}
