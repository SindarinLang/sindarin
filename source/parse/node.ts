import { AssignNode } from "./root/assign";
import { ImportNode } from "./root/modules";
import { IdentifierNode } from "./root/value/identifier";

export enum Kinds {
  root,
  import,
  export,
  from,
  module,
  assign,
  type,
  number,
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
