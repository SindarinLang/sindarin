import { Token, Tokens } from "../../../lex";
import { parseFrom, FromNode, FromKind } from "./from";
import { parseImport, ImportNode, ImportKind, importKind } from "./import";
import { parseExport, ExportNode, ExportKind } from "./export";
import { parseCurlyCSV } from "../../utils";
import { ASTNode, ParseResult } from "../../";

type Modules = {
  [name: string]: ModuleNode;
};

export const moduleKind = "module";

export type ModuleKind = typeof moduleKind;

export interface ModuleNode extends ASTNode {
  kind: ModuleKind;
  self: boolean; // always false at top level (no default)
  wildcard: boolean;
  modules?: Modules;
}

function moduleNode(self = false, wildcard = false, modules?: Modules): ModuleNode {
  return {
    kind: "module",
    self,
    wildcard,
    modules
  };
}

function pathContinues(tokens: Token[]) {
  return tokens[0].type === Tokens.identifier && tokens[1].type === Tokens.dot;
}

function mergeModule(modules: Modules = {}, key: string, value: ModuleNode) {
  return {
    ...modules,
    [key]: moduleNode(
      modules[key]?.self || value.self,
      modules[key]?.wildcard || value.wildcard,
      value.modules // TODO: actually deep merge this
    )
  };
}

function integrateModulePath(parent: ModuleNode, tokens: Token[]): ModuleNode {
  if(tokens.length === 1) {
    if(tokens[0].type === Tokens.multiply) {
      return moduleNode(parent.self, true, parent.modules);
    } else if(tokens[0].type === Tokens.identifier) {
      return moduleNode(
        parent.self,
        parent.wildcard,
        mergeModule(parent.modules, tokens[0].value, moduleNode(true))
      );
    } else {
      throw new Error("syntax error");
    }
  } else if(pathContinues(tokens)) {
    return moduleNode(
      parent.self,
      parent.wildcard,
      mergeModule(parent.modules, tokens[0].value, integrateModulePath(moduleNode(), tokens.slice(2)))
    );
  } else {
    throw new Error("syntax error");
  }
}

function parseWildcard(tokens: Token[]): ParseResult<ModuleNode> {
  if(tokens[1].type === Tokens.semi) {
    return {
      tokens: tokens.slice(2),
      node: moduleNode(false, true)
    };
  } else {
    throw new Error("syntax error");
  }
}

export function parseModules(tokens: Token[]): ParseResult<ModuleNode> {
  if(tokens[0].type === Tokens.multiply) {
    return parseWildcard(tokens);
  } else if(tokens[0].type === Tokens.open_curly) {
    const result = parseCurlyCSV(tokens);
    const modules = result.list.reduce((retval, group) => {
      return integrateModulePath(retval, group);
    }, moduleNode());
    if(result.tokens[0].type === Tokens.close_curly && result.tokens[1].type === Tokens.semi) {
      return {
        node: modules,
        tokens: result.tokens.slice(2)
      };
    } else {
      throw new Error("syntax error");
    }
  } else {
    throw new Error("syntax error");
  }
}

export {
  ImportNode,
  FromNode,
  ExportNode,
  parseFrom,
  parseImport,
  parseExport,
  FromKind,
  ImportKind,
  ExportKind,
  importKind
};
