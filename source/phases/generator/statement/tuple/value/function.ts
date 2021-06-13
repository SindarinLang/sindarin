import llvm from "llvm-bindings";
import { RootNode, FunctionNode, ParametersNode, isNode, Kinds, TypeNode } from "../../../../parser";
import { LLVMFile, setTable, SymbolTable } from "../../../file";
import { getFunctionType, Type, Primitives, SymbolValue, FunctionType, getBoolean, getType } from "../../../types";
import { buildStatement } from "../..";
import { getReturn } from "../../return";

let functionCounter = 0;

export function getFunction(file: LLVMFile, type: FunctionType, name?: string) {
  const fn = llvm.Function.Create(
    getFunctionType(file, type),
    llvm.Function.LinkageTypes.ExternalLinkage,
    name ?? `_f${functionCounter}`,
    file.mod
  );
  functionCounter +=1;
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

export function buildFunction(file: LLVMFile, node: RootNode | FunctionNode): SymbolValue[] {
  // Create Function
  const type: FunctionType = {
    ...getType(Primitives.Function),
    argumentTypes: isNode(node, Kinds.root) ? [] : getParameters(node.parameters),
    returnType: isNode(node, Kinds.root) ? getType(Primitives.Boolean) : typeNodeToType(node.type)
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
    getReturn(file, [
      getBoolean(file, false)
    ]);
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
