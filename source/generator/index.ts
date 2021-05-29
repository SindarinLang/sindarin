import llvm from "llvm-bindings";
import { AST } from "../parser";
import { getCore } from "./core";
import { getFile } from "./file";
import { buildAssign } from "./assign";
import { buildFunction } from "./function";
import { primitives } from "./primitive";
import { buildCall } from "./call";
import { buildReturn } from "./return";
import { buildBoolean } from "./value/boolean";
import { isNode, Kinds } from "../parser/node";

export function generate(ast: AST) {
  const file = getFile("main");
  const files = [file];
  const main = buildFunction("main", primitives.int1)(file);
  file.functionStack.push(main);
  const mainEntryBlock = llvm.BasicBlock.Create(file.context, "entry", main);
  file.builder.SetInsertionPoint(mainEntryBlock);
  ast.nodes.forEach((node) => {
    if(isNode(node, Kinds.import) && node.from === undefined) {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        file.functionTable[key] = core.exports[key];
      });
      files.push(core);
    } else if(isNode(node, Kinds.assignment)) {
      buildAssign(file, node);
    } else if(isNode(node, Kinds.callOperation)) {
      buildCall(file, node);
    }
  });
  buildReturn(file, buildBoolean(file, false).value);
  files.forEach((llvmFile) => {
    llvmFile.write();
  });
}
