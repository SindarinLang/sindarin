#include "ast.h"
#include <napi.h>
#include <uv.h>

using namespace Napi;

AST::AST(const CallbackInfo& info): ObjectWrap<AST>(info) {
  this->val = info[0].As<Number>().Int32Value();
};

void AST::Init(Napi::Env env, Object exports) {
  Function func = DefineClass(env, "AST", {});

  FunctionReference* constructor = new FunctionReference();
  *constructor = Persistent(func);
  env.SetInstanceData(constructor);
  //NOTE: this assumes only 1 class is exported     
  //for multiple exported classes, need a struct or other mechanism

  exports.Set("AST", func);
}

Object AST::NewInstance(Napi::Env env, Napi::Value arg) {
  Napi::Object obj = env.GetInstanceData<Napi::FunctionReference>()->New({
    arg
  });
  return obj;
}
