#include <string>
#include <iostream>
using namespace std;

#include "../lexer/index.hpp"

struct ASTBlock {
  string type;
  ASTBlock* next;
};

struct ImportASTBlock: ASTBlock {
  string from;
  bool all;
  // exports;
};

struct ExportItem {
  
  ExportItem* next;
};

struct ASTRoot {
  ASTBlock* block;
};

// *index = *(index->next);
static ASTBlock* parseImport(TokenLink* index) {
  ImportASTBlock* block = new ImportASTBlock;
  block->type = "import";
  if(index->next->token.code == tok_multiply) {
    block->all = true;
  } else {
    block->all = false;
    if(index->next->token.code == tok_open_curly) {
      *index = *(index->next);
      // parseCSV
      // while(index->next->token.code != tok_semi && index->next != nullptr) {
      
      // }
    } else {
      cout << "syntax error";
    }
  }
  return block;
}

static void parse(TokenLink* index) {
  ASTRoot root = {};
  ASTBlock* last = nullptr;
  while(index->next != nullptr) {
    ASTBlock* block;
    if(index->token.code == tok_import) {
      block = parseImport(index);
    }
    if(block) {
      if(last == nullptr) {
        root.block = block;
        last = block;
      } else {
        last->next = block;
        last = block;
      }
    } else {
      cout << "parse error";
    }
    index = index->next;
  }
  return;
}
