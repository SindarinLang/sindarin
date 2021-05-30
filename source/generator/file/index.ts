import { join } from "path";
import llvm from "llvm-bindings";
import { Primitive } from "../primitive";

export type SymbolTable = {
  [name: string]: SymbolValue;
};

export type SymbolFunction = (args?: Primitive[]) => SymbolValue<llvm.Function>;

type SymbolValueValue = llvm.Value | llvm.CallInst | llvm.Function;

export interface SymbolValue<T extends SymbolValueValue = SymbolValueValue> extends Primitive {
  value: T;
}

type FunctionTable = {
  [name: string]: SymbolFunction;
};

export type LLVMFile = {
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
  mod: llvm.Module;
  name: string;
  exports: {
    [name: string]: SymbolFunction;
  };
  symbolTable: SymbolTable;
  functionTable: FunctionTable;
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
    exports: {},
    symbolTable: {},
    functionTable: {},
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
