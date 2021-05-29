import llvm from "llvm-bindings";
import mem from "mem-fn";
import { LLVMFile } from "../file";
import { buildFunction } from "../function";
import { Primitive, primitives } from "../primitive";
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

function getTrue(file: LLVMFile) {
  return file.builder.CreateGlobalString("true");
}

function getFalse(file: LLVMFile) {
  return file.builder.CreateGlobalString("false");
}

function getUndefined(file: LLVMFile) {
  return file.builder.CreateGlobalString("undefined");
}

function getFormat(format: ValueOf<typeof formats>, file: LLVMFile) {
  return file.builder.CreateGlobalString(`%${format}\n`, `printf_format_${format}`, 0, file.mod);
}

const getFormatD = fileMem((file: LLVMFile) => {
  return getFormat(formats.decimal, file);
});

const getFormatF = fileMem((file: LLVMFile) => {
  return getFormat(formats.float, file);
});

const getFormatS = fileMem((file: LLVMFile) => {
  return getFormat(formats.string, file);
});

const getPrintF = fileMem((file: LLVMFile) => {
  return buildFunction("printf", primitives.int32, [primitives.int8Ptr], true)(file);
});

function getOutputI1(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatS(exporter);
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_i1", primitives.int32, [primitives.int1]);
  const fn = template(exporter);
  // blocks
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  const trueBlock = llvm.BasicBlock.Create(exporter.context, "true", fn);
  const falseBlock = llvm.BasicBlock.Create(exporter.context, "false", fn);
  // entry block
  exporter.builder.SetInsertionPoint(entryBlock);
  exporter.builder.CreateCondBr(fn.getArg(0), trueBlock, falseBlock);
  // true block
  exporter.builder.SetInsertionPoint(trueBlock);
  const trueResult = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    format,
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), getTrue(exporter)]);
  exporter.builder.CreateRet(trueResult);
  // false block
  exporter.builder.SetInsertionPoint(falseBlock);
  const falseResult = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    format,
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), getFalse(exporter)]);
  exporter.builder.CreateRet(falseResult);
  if(!llvm.verifyFunction(fn)) {
    return template(importer);
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputI32Ptr(exporter: LLVMFile, importer: LLVMFile) {
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_i32Ptr", primitives.int32, [primitives.int32Ptr]);
  const fn = template(exporter);
  // entry block
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  // result
  const pointer = exporter.builder.CreatePtrToInt(fn.getArg(0), exporter.builder.getInt32Ty());
  const isDefined = exporter.builder.CreateICmpNE(pointer, llvm.Constant.getNullValue(exporter.builder.getInt32Ty()));
  const trueBlock = llvm.BasicBlock.Create(exporter.context, "true", fn);
  const falseBlock = llvm.BasicBlock.Create(exporter.context, "false", fn);
  exporter.builder.CreateCondBr(isDefined, trueBlock, falseBlock);
  // true block
  exporter.builder.SetInsertionPoint(trueBlock);
  const value = exporter.builder.CreateLoad(exporter.builder.getInt32Ty(), fn.getArg(0));
  const trueResult = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    getFormatD(exporter),
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), value]);
  exporter.builder.CreateRet(trueResult);
  // false block
  exporter.builder.SetInsertionPoint(falseBlock);
  const falseResult = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
    getFormatS(exporter),
    [
      exporter.builder.getInt32(0),
      exporter.builder.getInt32(0)
    ]
  ), getUndefined(exporter)]);
  exporter.builder.CreateRet(falseResult);
  if(!llvm.verifyFunction(fn)) {
    return template(importer);
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputI32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatD(exporter);
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_i32", primitives.int32, [primitives.int32]);
  const fn = template(exporter);
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
    return template(importer);
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputF32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatF(exporter);
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_f32", primitives.int32, [primitives.float]);
  const fn = template(exporter);
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
    return template(importer);
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
}, {
  argumentTypes: [primitives.int1],
  fn: getOutputI1
}, {
  argumentTypes: [primitives.int32Ptr],
  fn: getOutputI32Ptr
}];

function matchOverride(argumentTypes: Primitive[], exporter: LLVMFile, importer: LLVMFile) {
  const match = overrides.find((override) => {
    return override.argumentTypes.find((type, index) => argumentTypes[index] !== type) === undefined;
  });
  if(match) {
    return {
      type: primitives.int32,
      value: match.fn(exporter, importer)
    };
  } else {
    throw new Error("Override not found");
  }
}

// TODO: just write this as a .ll
export function output(exporter: LLVMFile, importer: LLVMFile) {
  return (argumentTypes: Primitive[] = []) => {
    return matchOverride(argumentTypes, exporter, importer);
  };
}
