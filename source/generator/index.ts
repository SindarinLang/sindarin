import llvm from "llvm-bindings";
import { AST } from "../parser";
import { getCore } from "./core";
import { getFile } from "./file";
import { buildAssign } from "./assign";
import { buildFunction } from "./function";
import { buildReturn } from "./return";
import { getBoolean } from "./tuple/value/boolean";
import { isNode, Kinds } from "../parser/node";
import { buildTuple } from "./tuple";
import { getPrimitive, Types } from "./primitive";

export function generate(ast: AST) {
  const file = getFile("main");
  const files = [file];
  const main = buildFunction("main", getPrimitive(Types.Boolean))(file);
  file.functionStack.push(main);
  const mainEntryBlock = llvm.BasicBlock.Create(file.context, "entry", main);
  file.builder.SetInsertionPoint(mainEntryBlock);
  ast.value.value.forEach((node) => {
    if(isNode(node, Kinds.import) && node.from === undefined) {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        file.functionTable[key] = core.exports[key];
      });
      files.push(core);
    } else if(isNode(node, Kinds.assignment)) {
      buildAssign(file, node);
    } else if(isNode(node, Kinds.tuple)) {
      buildTuple(file, node);
    }
    // TODO: return, export
  });
  buildReturn(file, getBoolean(file, false)); // TODO: only if no return
  // TODO: split into separate step
  files.forEach((llvmFile) => {
    llvmFile.write();
  });
}
