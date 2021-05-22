#include <napi.h>
#include "ast.h"
using namespace Napi;

// import { createObject, add } from "../addons/addon";

// const obj1 = createObject(10);
// const obj2 = createObject(20);
// const result = add(obj1, obj2);

// console.log(obj1, obj2, result);

Object CreateObject(const CallbackInfo& info) {
  return AST::NewInstance(info.Env(), info[0]);
}

Number Add(const CallbackInfo& info) {
  Env env = info.Env();
  AST* obj1 = ObjectWrap<AST>::Unwrap(info[0].As<Object>());
  AST* obj2 = ObjectWrap<AST>::Unwrap(info[1].As<Object>());
  double sum = obj1->Val() + obj2->Val();
  return Number::New(env, sum);
}

Object InitAll(Env env, Object exports) {
  AST::Init(env, exports);
  exports.Set("createObject", Function::New(env, CreateObject));
  exports.Set("add", Function::New(env, Add));
  return exports;
}

NODE_API_MODULE(addon, InitAll)
