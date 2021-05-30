import llvm from "llvm-bindings";
import { ConditionalKeys, ValueOf } from "../utils";
import { LLVMFile } from "./file";

type PrimitiveKey = "int1" | "int32" | "int32Ptr" | "float" | "int8Ptr";

export const primitives: {
  [key in PrimitiveKey]: ConditionalKeys<typeof llvm.Type, (file: LLVMFile) => llvm.Type>;
} = {
  int1: "getInt1Ty",
  int32: "getInt32Ty",
  int32Ptr: "getInt32PtrTy",
  float: "getFloatTy",
  int8Ptr: "getInt8PtrTy"
};

export type Primitive = ValueOf<typeof primitives>;

type Override = {
  function: any;
  signature: Primitive[][];
};

export type Overrides = Override[];

export const getPrimitive = (file: LLVMFile, type: Primitive) => {
  return llvm.Type[type](file.context);
};

export function matchSignature(overrides: Overrides, signature: Primitive[]) {
  return overrides.find((override) => {
    return override.signature.reduce((retval, arg, index) => {
      return retval && arg.includes(signature[index]);
    }, true as boolean);
  })?.function ?? (() => undefined);
}

export function isInteger(primitive: Primitive) {
  return primitive === primitives.int32;
}

export function isFloat(primitive: Primitive) {
  return primitive === primitives.float;
}

export function isNumeric(primitive: Primitive) {
  return isInteger(primitive) || isFloat(primitive);
}

export function isBoolean(primitive: Primitive) {
  return primitive === primitives.int1;
}
