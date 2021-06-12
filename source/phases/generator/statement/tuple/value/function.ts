import llvm from "llvm-bindings";
import { buildStatement } from "../..";
import { RootNode, FunctionNode, ParametersNode, isNode, Kinds, TypeNode } from "../../../../parser";
import { LLVMFile, SymbolFunction, SymbolTable } from "../../../file";
import { getLLVMFunctionType, FunctionType, Types, getPrimitive, Primitive } from "../../../primitive";
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

function typeToPrimitive(node?: TypeNode): Primitive {
  if(node) {
    const type = Types[node.value as Types];
    if(type) {
      return {
        type
      };
    } else {
      throw new Error("Unsupported parameter type");
    }
  } else {
    throw new Error("Missing type");
  }
}

function getParameters(node: ParametersNode): Primitive[] {
  return node.value.map((parameterNode) => {
    if(isNode(parameterNode, Kinds.assignment)) {
      return typeToPrimitive(parameterNode.declaration.type);
    } else {
      throw new Error("Unsupported parameter");
    }
  });
}

function getArguments(node: ParametersNode, fn: llvm.Function): SymbolTable {
  return node.value.reduce((table, parameterNode, index) => {
    if(isNode(parameterNode, Kinds.assignment)) {
      const primitive = typeToPrimitive(parameterNode.declaration.type);
      table[parameterNode.declaration.identifier.value] = {
        type: primitive.type,
        value: fn.getArg(index)
      };
      return table;
    } else {
      throw new Error("Unsupported argument");
    }
  }, {} as SymbolTable);
}

export function buildFunction(file: LLVMFile, node: RootNode | FunctionNode): SymbolFunction {
  // Create Function
  const type: FunctionType = {
    argumentTypes: isNode(node, Kinds.root) ? [] : getParameters(node.parameters),
    returnType: isNode(node, Kinds.root) ? getPrimitive(Types.Boolean) : typeToPrimitive(node.type)
  };
  const fn = getFunction(file, type, isNode(node, Kinds.root) ? "main": undefined);
  // Push Scope
  const entry = llvm.BasicBlock.Create(file.context, "entry", fn);
  file.scopeStack.push({
    block: entry,
    symbolTable: isNode(node, Kinds.root) ? {} : getArguments(node.parameters, fn)
  });
  file.builder.SetInsertionPoint(entry);
  // Build Statements
  const statements = node.value;
  statements.forEach((statementNode) => {
    buildStatement(file, statementNode);
  });
  if(isNode(node, Kinds.root)) {
    getReturn(file, getBoolean(file, false));
  }
  // Pop Scope
  file.scopeStack.pop();
  if(file.scopeStack.length > 0) {
    file.builder.SetInsertionPoint(file.scopeStack[file.scopeStack.length-1].block);
  }
  return [{
    value: fn,
    type
  }];
}
