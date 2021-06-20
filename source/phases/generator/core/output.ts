/* eslint-disable max-lines */
import llvm from "llvm-bindings";
import mem from "mem-fn";
import { ValueOf } from "../../../utils";
import { Export, LLVMFile } from "../file";
import { getFunction } from "../statement/tuple/value/function";
import { getType, Primitives, getUInt8Value, FunctionType, getFunctionType, getRuneType, SymbolValue, FunctionSignature, fromPointer } from "../types";
import { castToFloat64 } from "../types/float32";
import { resolveOverride } from "../types/function";

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
  return getFunction(file, getFunctionType({
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.UInt8)],
    isVarArg: false,
    name: "putchar"
  }));
});

const getPrintF = fileMem((file: LLVMFile) => {
  return getFunction(file, getFunctionType({
    returnType: getType(Primitives.Int32),
    argumentTypes: [getType(Primitives.UInt8, true)],
    isVarArg: true,
    name: "printf"
  }));
});

function outputBoolean(exporter: LLVMFile, importer: LLVMFile): FunctionSignature {
  return {
    parameters: [
      [getType(Primitives.Boolean)]
    ],
    resolver: (args: SymbolValue[] = []) => {
      const format = getFormatS(exporter);
      const printf = getPrintF(exporter);
      // fn
      const argumentTypes = args.map((arg) => arg.type);
      const type: FunctionType = getFunctionType({
        returnType: getType(Primitives.Int32),
        argumentTypes: args.map((arg) => arg.type),
        name: "_output_i1"
      });
      const fn = getFunction(exporter, type);
      // blocks
      const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
      const trueBlock = llvm.BasicBlock.Create(exporter.context, "true", fn);
      const falseBlock = llvm.BasicBlock.Create(exporter.context, "false", fn);
      // entry block
      exporter.builder.SetInsertionPoint(entryBlock);
      const { value } = fromPointer(exporter, {
        value: fn.getArg(0),
        type: argumentTypes[0]
      });
      exporter.builder.CreateCondBr(value, trueBlock, falseBlock);
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
          value: getFunction(importer, type),
          type
        };
      } else {
        throw new Error("Function verification failed");
      }
    }
  };
}

function outputInt(exporter: LLVMFile, importer: LLVMFile): FunctionSignature {
  return {
    parameters: [
      [getType(Primitives.Int32)]
    ],
    resolver: (args: SymbolValue[] = []) => {
      const format = getFormatD(exporter);
      const printf = getPrintF(exporter);
      // fn
      const argumentTypes = args.map((arg) => arg.type);
      const type: FunctionType = getFunctionType({
        returnType: getType(Primitives.Int32),
        argumentTypes,
        name: "_output_i32"
      });
      const fn = getFunction(exporter, type);
      // entry block
      const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
      exporter.builder.SetInsertionPoint(entryBlock);
      // result
      const { value } = fromPointer(exporter, {
        value: fn.getArg(0),
        type: argumentTypes[0]
      });
      const result = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
        format,
        [
          exporter.builder.getInt32(0),
          exporter.builder.getInt32(0)
        ]
      ), value]);
      exporter.builder.CreateRet(result);
      if(!llvm.verifyFunction(fn)) {
        return {
          value: getFunction(importer, type),
          type
        };
      } else {
        throw new Error("Function verification failed");
      }
    }
  };
}

function outputFloat(exporter: LLVMFile, importer: LLVMFile): FunctionSignature {
  return {
    parameters: [
      [getType(Primitives.Float32), getType(Primitives.Float64)]
    ],
    resolver: (args: SymbolValue[] = []) => {
      const format = getFormatF(exporter);
      const printf = getPrintF(exporter);
      // fn
      const argumentTypes = args.map((arg) => arg.type);
      const type: FunctionType = getFunctionType({
        returnType: getType(Primitives.Int32),
        argumentTypes,
        name: "_output_float"
      });
      const fn = getFunction(exporter, type);
      // entry block
      const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
      exporter.builder.SetInsertionPoint(entryBlock);
      // cast to double
      const double = castToFloat64(exporter, {
        value: fn.getArg(0),
        type: argumentTypes[0]
      });
      // result
      const result = exporter.builder.CreateCall(printf, [exporter.builder.CreateGEP(
        format,
        [
          exporter.builder.getInt32(0),
          exporter.builder.getInt32(0)
        ]
      ), double.value]);
      exporter.builder.CreateRet(result);
      if(!llvm.verifyFunction(fn)) {
        return {
          value: getFunction(importer, type),
          type
        };
      } else {
        throw new Error("Function verification failed");
      }
    }
  };
}

function outputRune(exporter: LLVMFile, importer: LLVMFile): FunctionSignature {
  return {
    parameters: [
      [getRuneType()]
    ],
    resolver: (args: SymbolValue[] = []) => {
      const putchar = getPutChar(exporter);
      // fn
      const type: FunctionType = getFunctionType({
        returnType: getType(Primitives.Int32),
        argumentTypes: args.map((arg) => arg.type),
        name: "_output_Rune"
      });
      const fn = getFunction(exporter, type);
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
          exporter.types.UInt8,
          pointer
        )
      ]);
      exporter.builder.CreateCall(putchar, [getUInt8Value(exporter, "\n".charCodeAt(0))]);
      exporter.builder.CreateRet(result);
      if(!llvm.verifyFunction(fn)) {
        return {
          value: getFunction(importer, type),
          type
        };
      } else {
        throw new Error("Function verification failed");
      }
    }
  };
}

export function output(exporter: LLVMFile): Export {
  return (importer: LLVMFile) => (args?: SymbolValue[]) => {
    return resolveOverride([
      outputBoolean(exporter, importer),
      outputInt(exporter, importer),
      outputFloat(exporter, importer),
      outputRune(exporter, importer)
    ], args);
  };
}
