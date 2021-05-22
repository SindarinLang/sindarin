import llvm from "llvm-bindings";
import { AST } from "../parse";
import { isAssignNode, isFloat, isIdentifier, isImportNode, isInteger } from "../parse/node";
import { getCore } from "./core";
import { getFile } from "./file";
import { buildAssign } from "./assign";
import { getFunctionType, getSignature } from "./file/function";
import { Primitive, primitives } from "./primitive";
import { buildInteger } from "./assign/value/integer";
import { buildFloat } from "./assign/value/float";

export function translate(ast: AST) {
  console.log(JSON.stringify(ast, null, 2));
  const file = getFile("main");
  const files = [file];
  const main = file.createFunction(
    getFunctionType(primitives.int1),
    "main"
  );
  const mainEntryBlock = llvm.BasicBlock.Create(file.context, "entry", main);
  file.builder.SetInsertionPoint(mainEntryBlock);
  const functionTable: {
    [name: string]: (argumentTypes: Primitive[]) => llvm.Function;
  } = {};
  ast.nodes.forEach((node) => {
    if(isImportNode(node) && node.from === undefined) {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        functionTable[key] = core.exports[key];
      });
      files.push(core);
    } else if(isAssignNode(node)) {
      buildAssign(file, node);
    } else if(isIdentifier(node) && node.call) {
      const signature = getSignature(node.call, file.symbolTable);
      file.builder.CreateCall(functionTable.output(signature), node.call.value.map((valueNode) => {
        if(isIdentifier(valueNode)) {
          return file.symbolTable[valueNode.value].value;
        } else if(isInteger(valueNode)) {
          return buildInteger(file, valueNode.value);
        } else if(isFloat(valueNode)) {
          return buildFloat(file, valueNode.value);
        } else {
          return buildInteger(file, 0);
        }
      }));
    }
  });
  file.builder.CreateRet(llvm.ConstantInt.get(file.context, new llvm.APInt(1, 0, false)));
  files.forEach((llvmFile) => {
    llvmFile.write();
  });
}
