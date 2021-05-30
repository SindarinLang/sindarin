
export enum Kinds {
  root = "root",
  import = "import",
  export = "export",
  from = "from",
  module = "module",
  integer = "integer",
  float = "float",
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
