import { join } from "path";
import llvm from "llvm-bindings";
import { ConditionalKeys, ValueOf } from "./utils";

type GetFunctionTypeFn = (builder: llvm.IRBuilder) => llvm.FunctionType;

export type LLVMFile = {
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
  mod: llvm.Module;
  name: string;
  exports: {
    [name: string]: (argumentTypes: Primitive[]) => llvm.Function;
  };
  write: () => void;
  createFunction: (getType: GetFunctionTypeFn, name: string) => llvm.Function;
};

export const primitives: {
  [key: string]: ConditionalKeys<llvm.IRBuilder, () => llvm.Type>;
} = {
  int32: "getInt32Ty",
  float: "getFloatTy",
  int8Ptr: "getInt8PtrTy"
};

export type Primitive = ValueOf<typeof primitives>;

const getPrimitive = (type: Primitive, builder: llvm.IRBuilder) => {
  return builder[type]();
};

export function getFunctionType(returnType: Primitive, argumentTypes: Primitive[], isVarArg = false) {
  return (builder: llvm.IRBuilder) => {
    return llvm.FunctionType.get(
      getPrimitive(returnType, builder),
      argumentTypes.map((type) => getPrimitive(type, builder)),
      isVarArg
    );
  };
}

function createFunctionFn(builder: llvm.IRBuilder, mod: llvm.Module) {
  return (getType: GetFunctionTypeFn, name: string) => {
    return llvm.Function.Create(
      getType(builder),
      llvm.Function.LinkageTypes.ExternalLinkage,
      name,
      mod
    );
  };
}

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
    write: () => {
      if(!llvm.verifyModule(mod)) {
        return mod.print(join(process.cwd(), `code/${name}.ll`));
      } else {
        throw new Error("Module verification failed");
      }
    },
    createFunction: createFunctionFn(builder, mod)
  };
}
