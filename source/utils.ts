
export type ValueOf<T> = Extract<T[keyof T], string>;

export type ItemsOf<T> = T[Extract<keyof T, number>];

export type PromiseOrValue<T> = Promise<T> | T;

export type PromiseValue<PromiseType, Otherwise = PromiseType> =
  PromiseType extends PromiseOrValue<infer Value> ?
  { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1] :
  Otherwise;

export type ConditionalKeys<Base, Condition> = NonNullable<{
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;

export function asArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr];
}

export type Enum<T extends string> = {
  [Key in T]: Key;
};

export function getEnum<T extends Record<string, any>>(object: T) {
  return (Object.keys(object) as (keyof T)[]).reduce((retval, key) => {
    retval[key] = key;
    return retval;
  }, {} as {
    [Key in keyof T]: Key;
  });
}

export function createAction(
  fn: (...args: Array<any>) => any | Promise<any>,
  transformArgs: (...args: any[]) => Array<any> = (...args) => args
) {
  return async (...args: any[]) => {
    return Promise.resolve(fn(...transformArgs(...args))).then(() => undefined);
  };
}
