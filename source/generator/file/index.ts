import { join } from "path";
import llvm from "llvm-bindings";
import { FunctionType, Primitive } from "../primitive";

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
  symbolTable: SymbolTable;
  exports: SymbolTable;
  functionStack: llvm.Function[];
  write: () => void;
};

export function getFile(name: string): LLVMFile {
  const context = new llvm.LLVMContext();
  const builder = new llvm.IRBuilder(context);
  const mod = new llvm.Module(name, context);
  return {
    context,
    builder,
    mod,
    name,
    symbolTable: {},
    exports: {},
    functionStack: [],
    write: () => {
      // if(!llvm.verifyModule(mod)) {
      return mod.print(join(process.cwd(), `code/${name}.ll`));
      // } else {
      //   throw new Error("Module verification failed");
      // }
    }
  };
}
