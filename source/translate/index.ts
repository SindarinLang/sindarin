import llvm from "llvm-bindings";
import { AST } from "../parse";
import { isAssignNode, isFloat, isIdentifier, isImportNode, isInteger } from "../parse/node";
import { ArgumentsNode } from "../parse/root/value/identifier/arguments";
import { getCore } from "./core";
import { getFile, Primitive, primitives } from "./file";

type SymbolTable = {
  [name: string]: {
    type: Primitive;
    value: llvm.ConstantInt | llvm.ConstantFP;
  };
};

function getSignature(node: ArgumentsNode, symbolTable: SymbolTable) {
  return node.value.map((value) => {
    if(isInteger(value)) {
      return primitives.int32;
    } else if(isFloat(value)) {
      return primitives.float;
    } else if(isIdentifier(value)) {
      return symbolTable[value.value].type;
    } else {
      throw new Error("Unknown signature");
    }
  });
}

export function translate(ast: AST) {
  // console.log(JSON.stringify(ast, null, 2));
  const file = getFile("main");
  const files = [file];
  const main = llvm.Function.Create(
    llvm.FunctionType.get(
      file.builder.getInt1Ty(),
      [],
      false
    ),
    llvm.Function.LinkageTypes.ExternalLinkage,
    "main",
    file.mod
  );
  const mainEntryBlock = llvm.BasicBlock.Create(file.context, "entry", main);
  file.builder.SetInsertionPoint(mainEntryBlock);
  const symbolTable: SymbolTable = {};
  const functionTable: {
    [name: string]: (argumentTypes: Primitive[]) => llvm.Function;
  } = {};
  ast.nodes.forEach((node) => {
    if(isImportNode(node) && node.from === undefined) {
      const core = getCore(node.module, file);
      Object.keys(node.module.modules ?? {}).forEach((key) => {
        functionTable[key] = core.exports[key];
      });
      files.push(core);
    } else if(isAssignNode(node)) { // How do you handle calls / expressions at a global level? => declare global undef, assign in main
      if(isInteger(node.value)) {
        symbolTable[node.identifier] = {
          type: primitives.int32,
          value: llvm.ConstantInt.get(file.builder.getInt32Ty(), node.value.value)
        };
      } else if(isFloat(node.value)) {
        symbolTable[node.identifier] = {
          type: primitives.float,
          value: llvm.ConstantFP.get(file.builder.getFloatTy(), node.value.value)
        };
      }
    } else if(isIdentifier(node) && node.call) {
      const signature = getSignature(node.call, symbolTable);
      file.builder.CreateCall(functionTable.output(signature), node.call.value.map((valueNode) => {
        if(isIdentifier(valueNode)) {
          return symbolTable[valueNode.value].value;
        } else if(isInteger(valueNode)) {
          return llvm.ConstantInt.get(file.context, new llvm.APInt(32, valueNode.value, false));
        } else if(isFloat(valueNode)) {
          return llvm.ConstantFP.get(file.context, new llvm.APFloat(valueNode.value));
        } else {
          return llvm.ConstantInt.get(file.context, new llvm.APInt(32, 0, false));
        }
      }));
    }
  });
  file.builder.CreateRet(llvm.ConstantInt.get(file.context, new llvm.APInt(1, 0, false)));
  files.forEach((llvmFile) => {
    llvmFile.write();
  });
}
