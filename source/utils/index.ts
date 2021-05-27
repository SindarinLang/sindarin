
export type ValueOf<T> = T[keyof T];

export type ConditionalKeys<Base, Condition> = NonNullable<{
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;

export function asArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr];
}

export function getEnum<T extends Record<string, any>>(object: T) {
  return (Object.keys(object) as (keyof T)[]).reduce((retval, key) => {
    retval[key] = key;
    return retval;
  }, {} as {
    [Key in keyof T]: Key;
  });
}
