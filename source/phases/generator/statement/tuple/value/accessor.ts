import { isNode, Kinds, AccessorNode } from "../../../../parser";
import { LLVMFile } from "../../../file";
import { getFloat32 } from "../../../types";

export function buildAccessor(file: LLVMFile, node: AccessorNode) {
  if(isNode(node.left, Kinds.number) && isNode(node.right, Kinds.number)) {
    return [
      getFloat32(file, parseFloat(`${node.left.value}.${node.right.value}`))
    ];
  } else {
    throw new Error("Unsupported accessor");
  }
}

