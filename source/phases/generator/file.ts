import llvm from "llvm-bindings";
import { SymbolValue } from "./types";

export type SymbolTable = {
  [name: string]: SymbolValue[];
};

export type TypeTable = {
  [name: string]: llvm.Type;
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
  exports: {
    [name: string]: (importer: LLVMFile) => SymbolValue[];
  };
  types: TypeTable;
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

const context = new llvm.LLVMContext();

const Void = llvm.Type.getVoidTy(context);
const Boolean = llvm.Type.getInt1Ty(context);
const Int8 = llvm.Type.getInt8Ty(context);
const Int16 = llvm.Type.getInt16Ty(context);
const Int32 = llvm.Type.getInt32Ty(context);
const Int64 = llvm.Type.getInt64Ty(context);
const Int128 = llvm.Type.getInt128Ty(context);
const Float32 = llvm.Type.getFloatTy(context);
const Float64 = llvm.Type.getDoubleTy(context);
const Float128 = llvm.Type.getFP128Ty(context);
const Rune = llvm.StructType.create(context, [
  Int32,
  llvm.Type.getInt8PtrTy(context)
], "Rune");

export function getFile(name: string): LLVMFile {
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
    types: {
      Void,
      Boolean,
      Int8,
      UInt8: Int8,
      Int16,
      Int32,
      Int64,
      Int128,
      Float32,
      Float64,
      Float128,
      Rune
    },
    scopeStack: []
  };
}
