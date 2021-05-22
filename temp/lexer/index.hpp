#include <fstream>
using namespace std;

#include "token/index.hpp"

struct TokenLink {
  Token token;
  TokenLink* next;
};

static TokenLink* push(TokenLink* last, Token token) {
  TokenLink* link = new TokenLink;
  link->token = {
    token.code,
    token.value
  };
  link->next = nullptr;
  last->next = link;
  return link;
}

static TokenLink* lex(fstream& file) {
  TokenLink head = {};
  TokenLink* last = &head;
  do {
    Token token = getToken(file);
    last = push(last, token);
  } while(last->token.code != tok_eof);
  return head.next;
}
