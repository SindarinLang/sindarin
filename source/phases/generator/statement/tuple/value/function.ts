import llvm from "llvm-bindings";
import { FunctionNode, ParametersNode, isNode, Kinds, TypeNode } from "../../../../parser";
import { LLVMFile, setTable, SymbolTable } from "../../../file";
import { getFunctionLLVMType, Type, Primitives, SymbolValue, FunctionType, getType, getFunctionType } from "../../../types";
import { buildStatement } from "../..";

let functionCounter = 0;

export function getFunction(file: LLVMFile, type: FunctionType) {
  const fn = llvm.Function.Create(
    getFunctionLLVMType(file, type),
    llvm.Function.LinkageTypes.ExternalLinkage,
    type.name,
    file.mod
  );
  return fn;
}

function typeNodeToType(node?: TypeNode): Type {
  if(node) {
    const primitive = Primitives[node.value.primitive as Primitives];
    if(primitive) {
      return getType(primitive);
    } else {
      throw new Error("Unsupported parameter type");
    }
  } else {
    throw new Error("Missing type");
  }
}

function getParameters(node: ParametersNode): Type[] {
  return node.value.map((parameterNode) => {
    if(isNode(parameterNode, Kinds.assignment)) {
      return typeNodeToType(parameterNode.declaration.type);
    } else {
      throw new Error("Unsupported parameter");
    }
  });
}

function getArguments(node: ParametersNode, fn: llvm.Function): SymbolTable {
  return node.value.reduce((table, parameterNode, index) => {
    if(isNode(parameterNode, Kinds.assignment)) {
      const type = typeNodeToType(parameterNode.declaration.type);
      return setTable(table, parameterNode.declaration.identifier.value, {
        type,
        value: fn.getArg(index)
      });
    } else {
      throw new Error("Unsupported argument");
    }
  }, {} as SymbolTable);
}


export function buildFunction(file: LLVMFile, node: FunctionNode): SymbolValue[] {
  // Create Function
  const type: FunctionType = getFunctionType({
    argumentTypes: getParameters(node.parameters),
    returnType: typeNodeToType(node.type),
    name: `_f${functionCounter}`
  });
  functionCounter +=1;
  const fn = getFunction(file, type);
  // Push Scope
  const entry = llvm.BasicBlock.Create(file.context, "entry", fn);
  file.scopeStack.push({
    block: entry,
    symbolTable: getArguments(node.parameters, fn)
  });
  file.builder.SetInsertionPoint(entry);
  // Build Statements
  const statements = node.value;
  statements.forEach((statementNode) => {
    buildStatement(file, statementNode);
  });
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
