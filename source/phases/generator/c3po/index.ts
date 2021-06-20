import { spawn } from "child_process";
import { join } from "path";
import { writeFile } from "write-file-safe";
import { getTempDir } from "../../../utils";
import { LLVMFile } from "..";
import { FunctionType, getFunctionType, getType, Primitives, StructType, Type } from "../types";
import { getFunction } from "../statement/tuple/value/function";
import { setSymbol } from "../file";
import { ModuleNode } from "../../parser";

type Types = {
  [name: string]: Type;
};

type ClangASTNode = {
  id: string;
  kind: string;
  name?: string;
  type?: {
    desugaredQualType?: string;
    qualType: string;
  };
  variadic?: boolean;
  inner?: ClangASTNode[];
};

interface ClangASTRoot extends ClangASTNode {
  kind: "TranslationUnitDecl",
  inner: ClangASTNode[];
}

function cleanType(type: string) {
  return type.replace("const ", "").replace("struct ", "").replace("restrict", "").trim();
}

function squashPrimitive(type: Type) {
  return type.isPointer ? type : type.primitive;
}

function parseType(raw = "", types: Types): Type | undefined {
  const cleaned = cleanType(raw);
  if(cleaned.endsWith("*")) {
    const type = parseType(cleaned.slice(0, -1), types);
    if(type !== undefined) {
      return getType(squashPrimitive(type), true, true);
    } else {
      return undefined;
    }
  } else if(types[cleaned]) {
    return getType(squashPrimitive(types[cleaned]));
  } else {
    return undefined;
  }
}

function parseStruct(node: ClangASTNode, types: Types): Type | undefined {
  if(node.name) {
    const type: StructType = {
      primitive: Primitives.Struct,
      name: node.name,
      fields: {},
      isPointer: false,
      isOptional: false
    };
    const items = node.inner ?? [];
    for(let i=0; i<items.length; i+=1) {
      const item = items[i];
      if(item.kind === "RecordDecl" && item.name) {
        const value = parseStruct(item, types);
        if(value === undefined) {
          return undefined;
        } else {
          type.fields[item.name] = value;
        }
      } else if(item.type && item.name) {
        const value = parseType(item.type.qualType, types);
        if(value === undefined) {
          return undefined;
        } else {
          type.fields[item.name] = value;
        }
      } else {
        return undefined;
      }
    }
    return type;
  } else {
    return undefined;
  }
}

function parseFunction(node: ClangASTNode, types: Types): FunctionType | undefined {
  const split = node.type?.qualType.split("(");
  const returnType = parseType(split?.[0], types);
  const argumentTypes = (node.inner ?? []).reduce((arr, item) => {
    if(arr === undefined) {
      return undefined;
    } else if(item.kind === "ParamVarDecl") {
      const type = parseType(item.type?.qualType, types);
      return type === undefined ? type : arr.concat(type);
    } else {
      return arr;
    }
  }, [] as (Type[] | undefined));
  if(returnType && argumentTypes && node.name) {
    return getFunctionType({
      returnType,
      argumentTypes,
      isVarArg: node.variadic ?? false,
      name: node.name
    });
  } else {
    return undefined;
  }
}

export async function include(file: LLVMFile, from: string, moduleNode: ModuleNode) {
  const temp = await getTempDir();
  const path = join(temp.path, "include.h");
  await writeFile(path, `#include ${from}`);
  return new Promise((resolve) => {
    const clang = spawn("clang", [
      "-Xclang",
      "-ast-dump=json",
      "-fsyntax-only",
      path
    ]);
    let buffer = "";
    clang.stdout.on("data", (data) => {
      buffer += data;
    });
    clang.on("close", () => {
      const types: Types = {
        "void": getType(Primitives.Void),
        "char": getType(Primitives.UInt8),
        "unsigned char": getType(Primitives.UInt8),
        "signed char": getType(Primitives.Int8),
        "short": getType(Primitives.Int16),
        "unsigned short": getType(Primitives.UInt16),
        "int": getType(Primitives.Int32),
        "unsigned int": getType(Primitives.UInt32),
        "long": getType(Primitives.Int64),
        "long long": getType(Primitives.Int64),
        "unsigned long": getType(Primitives.UInt64),
        "unsigned long long": getType(Primitives.UInt64),
        "__int128": getType(Primitives.Int128),
        "unsigned __int128": getType(Primitives.UInt128),
        "float": getType(Primitives.Float32),
        "double": getType(Primitives.Float64),
        "long double": getType(Primitives.Float128)
      };
      const ast = JSON.parse(buffer) as ClangASTRoot;
      ast.inner.forEach((node) => {
        if(node.name && moduleNode.modules) {
          if(node.kind === "TypedefDecl") {
            const type = parseType(node.type?.qualType, types);
            if(type) {
              types[node.name] = type;
            }
          } else if(node.kind === "RecordDecl") {
            const type = parseStruct(node, types);
            if(type) {
              types[node.name] = type;
            }
          } else if(node.kind === "FunctionDecl") {
            const type = parseFunction(node, types);
            if(type && moduleNode.modules[node.name]) {
              setSymbol(file, node.name, [{
                value: getFunction(file, type),
                type
              }]);
            }
          }
        }
      });
      temp.cleanup();
      resolve(file);
    });
  });
}
