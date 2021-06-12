import llvm from "llvm-bindings";
import { Primitive, FunctionType } from "../primitive";

export type FunctionOverride = {
  type: FunctionType;
  value: llvm.Function;
};

export type SymbolFunction = FunctionOverride[];

export type LLVMValue = llvm.Value | llvm.CallInst;

export interface SymbolValue<T extends LLVMValue = LLVMValue> extends Primitive {
  value: T;
}

export type SymbolTable = {
  [name: string]: SymbolValue | SymbolFunction;
};

type Scope = {
  block: llvm.BasicBlock;
  symbolTable: SymbolTable;
};

export type LLVMFile = {
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
  mod: llvm.Module;
  name: string;
  imports: LLVMFile[];
  exports: SymbolTable;
  scopeStack: Scope[];
};

export function setSymbol(file: LLVMFile, name: string, value: SymbolValue | SymbolFunction) {
  file.scopeStack[file.scopeStack.length-1].symbolTable[name] = value;
}

export function getSymbol(file: LLVMFile, name: string) {
  for(let i=file.scopeStack.length-1; i>=0; i-=1) {
    if(file.scopeStack[i].symbolTable[name]) {
      return file.scopeStack[i].symbolTable[name];
    }
  }
  return undefined;
}

export function getFile(name: string): LLVMFile {
  const context = new llvm.LLVMContext();
  const builder = new llvm.IRBuilder(context);
  const mod = new llvm.Module(name, context);
  const imports: LLVMFile[] = [];
  return {
    context,
    builder,
    mod,
    name,
    imports,
    exports: {},
    scopeStack: []
  };
}
