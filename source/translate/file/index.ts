import { join } from "path";
import llvm from "llvm-bindings";
import { createFunctionFn, GetFunctionTypeFn } from "./function";
import { getPrimitive, Primitive } from "../primitive";

export type SymbolTable = {
  [name: string]: SymbolValue;
};

export type SymbolValue = {
  type: Primitive;
  value: llvm.Value;
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
  write: () => void;
  getPrimitive: (type: Primitive) => llvm.Type;
  createFunction: (getType: GetFunctionTypeFn, name: string) => llvm.Function;
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
    write: () => {
      if(!llvm.verifyModule(mod)) {
        return mod.print(join(process.cwd(), `code/${name}.ll`));
      } else {
        throw new Error("Module verification failed");
      }
    },
    getPrimitive: getPrimitive(builder),
    createFunction: createFunctionFn(builder, mod)
  };
}
