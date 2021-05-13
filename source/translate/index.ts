import { AST, ASTNode, nodeKinds } from "../parse";
import { ImportNode } from "../parse/root/modules";
import { getCore } from "./core";
import { getFile } from "./file";

function isImportNode(node: ASTNode): node is ImportNode {
  return node.kind === nodeKinds.ImportKind;
}

export function translate(ast: AST) {
  const file = getFile("main");
  ast.nodes.forEach((node) => {
    if(isImportNode(node) && node.from === undefined) {
      const core = getCore(node.module);
      core.write();
    } else if(node.kind === nodeKinds.AssignKind) {
      // create global variable
    } else if(node.kind === nodeKinds.IdentifierKind) { // && node.call
      // call in main function
    }
  });
  console.log(JSON.stringify(ast, null, 2));
}
