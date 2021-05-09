
#ifndef AST_H
#define AST_H

#include <napi.h>

using namespace Napi;

class AST: public ObjectWrap<AST> {
 public:
  static void Init(Napi::Env env, Napi::Object exports);
  static Napi::Object NewInstance(Napi::Env env, Napi::Value arg);
  int Val() const {
    return val;
  }
  AST(const Napi::CallbackInfo& info);

 private:
  int val;
};

#endif
