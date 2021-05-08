#include <iostream>
#include <fstream>
using namespace std;

#include "lexer/index.hpp"

int main(int argc, char *argv[]) {
  fstream file;
  if(argc < 2) {
    cout << "Not enough arguments";
  } else {
    file.open(argv[1], ios::in);
    if(!file) {
      cout << "No such file";
    } else {
      TokenLink* index = lex(file);
      while(index->next != nullptr) {
        cout << "token: " << index->token.code << "\t" << index->token.value << endl;
        index = index->next;
      }
    }
    file.close();
    return 0;
  }
}
