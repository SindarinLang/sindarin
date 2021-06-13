import llvm from "llvm-bindings";
import { SymbolValue } from "./types";

export type SymbolTable = {
  [name: string]: SymbolValue[];
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

export function setTable(table: SymbolTable, name: string, symbol: SymbolValue) {
  if(table[name] === undefined) {
    table[name] = [];
  }
  table[name].push(symbol);
  return table;
}

export function setSymbol(file: LLVMFile, name: string, symbols: SymbolValue[]) {
  symbols.forEach((symbol) => {
    setTable(file.scopeStack[file.scopeStack.length-1].symbolTable, name, symbol);
  });
}

export function getSymbol(file: LLVMFile, name: string) {
  for(let i=file.scopeStack.length-1; i>=0; i-=1) {
    if(file.scopeStack[i].symbolTable[name]) {
      return file.scopeStack[i].symbolTable[name];
    }
  }
  return [];
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
