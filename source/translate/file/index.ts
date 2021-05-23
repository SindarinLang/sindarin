import { join } from "path";
import llvm from "llvm-bindings";
import { getPrimitive, Primitive } from "../primitive";

export type SymbolTable = {
  [name: string]: SymbolValue;
};

export type SymbolValue = {
  type: Primitive;
  value: llvm.Value;
};

type FunctionTable = {
  [name: string]: (argumentTypes: Primitive[]) => llvm.Function;
};

export type LLVMFile = {
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
  mod: llvm.Module;
  name: string;
  exports: {
    [name: string]: (argumentTypes: Primitive[]) => llvm.Function;
  };
  symbolTable: SymbolTable;
  functionTable: FunctionTable;
  write: () => void;
  getPrimitive: (type: Primitive) => llvm.Type;
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
    write: () => {
      if(!llvm.verifyModule(mod)) {
        return mod.print(join(process.cwd(), `code/${name}.ll`));
      } else {
        throw new Error("Module verification failed");
      }
    },
    getPrimitive: getPrimitive(builder)
  };
}
