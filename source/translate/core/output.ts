import llvm from "llvm-bindings";
import mem from "mem-fn";
import { getFunctionType, LLVMFile, primitives, Primitive } from "../file";
import { ValueOf } from "../utils";

function fileMem(fn: (file: LLVMFile) => any) {
  return mem(fn, {
    cacheKeyFn: (file: LLVMFile) => file.name
  });
}

const formats = {
  decimal: "d",
  float: "f",
  string: "s"
};

function getFormat(format: ValueOf<typeof formats>, file: LLVMFile) {
  return file.builder.CreateGlobalString(`%${format}\n`, `printf_format_${format}`, 0, file.mod);
}

const getFormatD = fileMem((file: LLVMFile) => {
  return getFormat(formats.decimal, file);
});

const getFormatF = fileMem((file: LLVMFile) => {
  return getFormat(formats.float, file);
});

const getPrintF = fileMem((file: LLVMFile) => {
  const type = getFunctionType(primitives.int32, [primitives.int8Ptr], true);
  return file.createFunction(type, "printf");
});

function getOutputI32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatD(exporter);
  const printf = getPrintF(exporter);
  // fn
  const type = getFunctionType(primitives.int32, [primitives.int32]);
  const name = "_output_i32";
  const fn = exporter.createFunction(type, name);
  // entry block
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  // result
  const result = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    format,
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), fn.getArg(0)]);
  exporter.builder.CreateRet(result);
  if(!llvm.verifyFunction(fn)) {
    return importer.createFunction(type, name);
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputF32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatF(exporter);
  const printf = getPrintF(exporter);
  // fn
  const type = getFunctionType(primitives.int32, [primitives.float]);
  const name = "_output_f32";
  const fn = exporter.createFunction(type, name);
  // entry block
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  // cast to double
  const double = exporter.builder.CreateFPExt(fn.getArg(0), exporter.builder.getDoubleTy());
  // result
  const result = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    format,
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), double]);
  exporter.builder.CreateRet(result);
  if(!llvm.verifyFunction(fn)) {
    return importer.createFunction(type, name);
  } else {
    throw new Error("Function verification failed");
  }
}

const overrides: {
  argumentTypes: Primitive[],
  fn: (exporter: LLVMFile, importer: LLVMFile) => llvm.Function;
}[] = [{
  argumentTypes: [primitives.int32],
  fn: getOutputI32
}, {
  argumentTypes: [primitives.float],
  fn: getOutputF32
}];

function matchOverride(argumentTypes: Primitive[], exporter: LLVMFile, importer: LLVMFile) {
  const match = overrides.find((override) => {
    return override.argumentTypes.find((type, index) => argumentTypes[index] !== type) === undefined;
  });
  if(match) {
    return match.fn(exporter, importer);
  } else {
    throw new Error("Override not found");
  }
}

export function output(exporter: LLVMFile, importer: LLVMFile) {
  return (argumentTypes: Primitive[]) => {
    return matchOverride(argumentTypes, exporter, importer);
  };
}
