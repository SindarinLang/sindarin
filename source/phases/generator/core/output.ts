/* eslint-disable max-lines */
import llvm from "llvm-bindings";
import mem from "mem-fn";
import { ValueOf } from "../../../utils";
import { LLVMFile } from "../file";
import { getFunction } from "../statement/tuple/value/function";
import { getType, Primitives, SymbolValue, getUInt8Type, getUInt8Value } from "../types";

function fileMem<T extends llvm.Function | llvm.GlobalVariable>(fn: (file: LLVMFile) => T) {
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

const getPutChar = fileMem((file: LLVMFile) => {
  return getFunction(file, {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.UInt8)],
    isVarArg: false
  }, "putchar");
});

const getPrintF = fileMem((file: LLVMFile) => {
  return getFunction(file, {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.UInt8, true)],
    isVarArg: true
  }, "printf");
});

function getOutputI1(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatS(exporter);
  const printf = getPrintF(exporter);
  // fn
  const type = {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.Boolean)]
  };
  const fn = getFunction(exporter, type, "_output_i1");
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
    return {
      value: getFunction(importer, type, "_output_i1"),
      type
    };
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputI32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatD(exporter);
  const printf = getPrintF(exporter);
  // fn
  const type = {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.Int32)]
  };
  const fn = getFunction(exporter, type, "_output_i32");
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
    return {
      value: getFunction(importer, type, "_output_i32"),
      type
    };
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputF32(exporter: LLVMFile, importer: LLVMFile) {
  const format = getFormatF(exporter);
  const printf = getPrintF(exporter);
  // fn
  const type = {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.Float32)]
  };
  const fn = getFunction(exporter, type, "_output_f32");
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
    return {
      value: getFunction(importer, type, "_output_f32"),
      type
    };
  } else {
    throw new Error("Function verification failed");
  }
}

function getOutputRune(exporter: LLVMFile, importer: LLVMFile) {
  const putchar = getPutChar(exporter);
  // fn
  const type = {
    ...getType(Primitives.Function),
    returnType: getType(Primitives.Int32),
    argumentTypes: [
      getType(Primitives.Rune, true)
    ]
  };
  const fn = getFunction(exporter, type, "_output_Rune");
  // entry block
  const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
  exporter.builder.SetInsertionPoint(entryBlock);
  // result
  const zero = exporter.builder.getInt32(0);
  const pointer = exporter.builder.CreateLoad(
    llvm.Type.getInt8PtrTy(exporter.context),
    exporter.builder.CreateGEP(fn.getArg(0), [zero, exporter.builder.getInt32(1)])
  );
  const result = exporter.builder.CreateCall(putchar, [
    exporter.builder.CreateLoad(
      getUInt8Type(exporter),
      pointer
    )
  ]);
  exporter.builder.CreateCall(putchar, [getUInt8Value(exporter, "\n".charCodeAt(0))]);
  exporter.builder.CreateRet(result);
  if(!llvm.verifyFunction(fn)) {
    return {
      value: getFunction(importer, type, "_output_Rune"),
      type
    };
  } else {
    throw new Error("Function verification failed");
  }
}

export function output(exporter: LLVMFile, importer: LLVMFile): SymbolValue[] {
  return [
    getOutputI1(exporter, importer),
    getOutputI32(exporter, importer),
    getOutputF32(exporter, importer),
    getOutputRune(exporter, importer)
  ];
}
