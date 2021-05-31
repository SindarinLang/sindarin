import llvm from "llvm-bindings";
import { buildStatement } from "../..";
import { RootNode } from "../../../../parser";
import { isNode, Kinds } from "../../../../parser/node";
import { FunctionNode } from "../../../../parser/statement/tuple/expression/operand/value-operation/value/function";
import { LLVMFile, SymbolFunction } from "../../../file";
import { getLLVMFunctionType, FunctionType, Types, getPrimitive } from "../../../primitive";
import { getReturn } from "../../return";
import { getBoolean } from "./boolean";

let functionCounter = 0;

export function getFunction(file: LLVMFile, type: FunctionType, name?: string) {
  const fn = llvm.Function.Create(
    getLLVMFunctionType(file, type),
    llvm.Function.LinkageTypes.ExternalLinkage,
    name ?? `_f${functionCounter}`,
    file.mod
  );
  functionCounter +=1;
  return fn;
}

export function buildFunction(file: LLVMFile, node: FunctionNode | RootNode): SymbolFunction {
  const type: FunctionType = {
    argumentTypes: [],
    returnType: isNode(node, Kinds.function) ? getPrimitive(Types.Int32) : getPrimitive(Types.Boolean)
  };
  const fn = getFunction(file, type, isNode(node, Kinds.root) ? "main": undefined);
  const entry = llvm.BasicBlock.Create(file.context, "entry", fn);
  file.blockStack.push(entry);
  file.builder.SetInsertionPoint(entry);
  const statements = isNode(node, Kinds.function) ? node.body.value : node.value.value;
  statements.forEach((statementNode) => {
    buildStatement(file, statementNode);
  });
  if(isNode(node, Kinds.root)) {
    getReturn(file, getBoolean(file, false));
  }
  file.blockStack.pop();
  if(file.blockStack.length > 0) {
    file.builder.SetInsertionPoint(file.blockStack[file.blockStack.length-1]);
  }
  return [{
    value: fn,
    type
  }];
}
