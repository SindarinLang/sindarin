import { haveTokens, Token, Tokens } from "../scanner";
import { ASTNode, Kinds } from "./node";
import { AssignmentNode, parseAssign } from "./statement/assignment";
import { SpreadNode, parseSpread } from "./spread";
import { getParseError, ParsePhase } from ".";
import { parseCommaList } from "./list";
import { parseVoid, VoidNode } from "./statement/tuple/void";

type ParameterNode = AssignmentNode | SpreadNode | VoidNode;

export interface ParametersNode extends ASTNode {
  kind: Kinds.parameters;
  value: ParameterNode[];
}

const getParsers: () => ParsePhase<ParameterNode>[] = () => [
  parseAssign,
  parseSpread,
  parseVoid
];

export const parseParameters: ParsePhase<ParametersNode> = (tokens: Token[]) => {
  const listResult = parseCommaList(tokens, getParsers());
  if(listResult.value && !haveTokens(listResult.context, Tokens.semi)) {
    return {
      context: listResult.context,
      value: {
        kind: Kinds.parameters,
        value: listResult.value.value
      },
      errors: []
    };
  } else {
    return {
      context: tokens,
      value: undefined,
      errors: [
        getParseError(Kinds.parameters, tokens[0].location)
      ]
    };
  }
};
