import { AST } from "../parse";
import { isAssignNode, isIdentifier, isImportNode } from "../parse/node";
import { getCore } from "./core";
import { getFile } from "./file";

export function translate(ast: AST) {
  const file = getFile("main");
  ast.nodes.forEach((node) => {
    if(isImportNode(node) && node.from === undefined) {
      const core = getCore(node.module);
      core.write();
    } else if(isAssignNode(node)) {
      // create global variable
    } else if(isIdentifier(node)) { // && node.call
      // call in main function
    }
  });
  console.log(JSON.stringify(ast, null, 2));
}
