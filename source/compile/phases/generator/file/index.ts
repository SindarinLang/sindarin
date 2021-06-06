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

export type LLVMFile = {
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
  mod: llvm.Module;
  name: string;
  imports: LLVMFile[];
  exports: SymbolTable;
  symbolTable: SymbolTable;
  blockStack: llvm.BasicBlock[];
};

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
    symbolTable: {},
    blockStack: []
  };
}
