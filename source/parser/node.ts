
export enum Kinds {
  root = "root",
  import = "import",
  export = "export",
  from = "from",
  module = "module",
  assign = "assign",
  type = "type",
  integer = "integer",
  float = "float",
  string = "string",
  boolean = "boolean",
  null = "null",
  unaryOperation = "unaryOperation",
  binaryOperation = "binaryOperation",
  callOperation = "callOperation",
  indexOperation = "indexOperation",
  tuple = "tuple",
  identifier = "identifier",
  array = "array",
  struct = "struct",
  function = "function",
  void = "void",
  arguments = "arguments",
  accessor = "accessor",
  parameters = "parameters",
  return = "return"
}

export type ASTNode<K extends Kinds = Kinds> = {
  kind: K;
};

export function isNode<K extends Kinds>(node: ASTNode, kind: K): node is ASTNode<K> {
  return node.kind === kind;
}
