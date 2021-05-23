import llvm from "llvm-bindings";
import { AST } from "../parse";
import { isAssignNode, isCallNode, isImportNode } from "../parse/node";
import { getCore } from "./core";
import { getFile } from "./file";
import { buildAssign } from "./assign";
import { buildFunction } from "./function";
import { primitives } from "./primitive";
import { buildCall } from "./call";
import { buildReturn } from "./return";
import { buildBoolean } from "./assign/value/boolean";

export function translate(ast: AST) {
  console.log(JSON.stringify(ast, null, 2));
  const file = getFile("main");
  const files = [file];
  const main = buildFunction("main", primitives.int1)(file);
  const mainEntryBlock = llvm.BasicBlock.Create(file.context, "entry", main);
  file.builder.SetInsertionPoint(mainEntryBlock);
  ast.nodes.forEach((node) => {
    if(isImportNode(node) && node.from === undefined) {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        file.functionTable[key] = core.exports[key];
      });
      files.push(core);
    } else if(isAssignNode(node)) {
      buildAssign(file, node);
    } else if(isCallNode(node)) {
      buildCall(file, node);
    }
  });
  buildReturn(file, buildBoolean(file, false).value);
  files.forEach((llvmFile) => {
    llvmFile.write();
  });
}
