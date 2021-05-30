import llvm from "llvm-bindings";
import mem from "mem-fn";
import { LLVMFile } from "../file";
import { buildFunction, matchSignature, Overrides } from "../function";
import { getPrimitive, Primitive, Types } from "../primitive";
import { ValueOf } from "../../utils";

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
  return buildFunction("printf", getPrimitive(Types.Int32), [getPrimitive(Types.UInt8, true)], true)(file);
});

function getOutputI1(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatS(exporter);
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_i1", getPrimitive(Types.Int32), [getPrimitive(Types.Boolean)]);
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

function getOutputI32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatD(exporter);
  const printf = getPrintF(exporter);
  // fn
  const template = buildFunction("_output_i32", getPrimitive(Types.Int32), [getPrimitive(Types.Int32)]);
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
  const template = buildFunction("_output_f32", getPrimitive(Types.Int32), [getPrimitive(Types.Float32)]);
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

const overrides: Overrides<
  (exporter: LLVMFile, importer: LLVMFile) => llvm.Function
> = [{
  signature: [
    [Types.Int32]
  ],
  fn: getOutputI32
}, {
  signature: [
    [Types.Float32]
  ],
  fn: getOutputF32
}, {
  signature: [
    [Types.Boolean]
  ],
  fn: getOutputI1
}];

export function output(exporter: LLVMFile, importer: LLVMFile) {
  return (args: Primitive[] = []) => {
    const value = matchSignature(overrides, args)(exporter, importer);
    if(value !== undefined) {
      return {
        type: Types.Int32,
        value
      };
    } else {
      throw new Error("No matching signature");
    }
  };
}
