import { isNode, Kinds } from "../../../parser/node";
import { AccessorNode } from "../../../parser/statement/tuple/expression/operand/value-operation/accessor";
import { LLVMFile } from "../../file";
import { Types } from "../../primitive";
import { getFloat } from "./float";

export function buildAccessor(file: LLVMFile, node: AccessorNode) {
  if(isNode(node.left, Kinds.integer) && isNode(node.right, Kinds.integer)) {
    return {
      type: Types.Float32,
      value: getFloat(file, parseFloat(`${node.left.value}.${node.right.value}`))
    };
  } else {
    throw new Error("Unsupported accessor");
  }
}

