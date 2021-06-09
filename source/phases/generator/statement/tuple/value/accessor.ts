import { isNode, Kinds } from "../../../../parser/node";
import { AccessorNode } from "../../../../parser/statement/tuple/value/operation/accessor";
import { LLVMFile } from "../../../file";
import { Types } from "../../../primitive";
import { getFloat } from "./float";

export function buildAccessor(file: LLVMFile, node: AccessorNode) {
  if(isNode(node.left, Kinds.number) && isNode(node.right, Kinds.number)) {
    return {
      type: Types.Float32,
      value: getFloat(file, parseFloat(`${node.left.value}.${node.right.value}`))
    };
  } else {
    throw new Error("Unsupported accessor");
  }
}

