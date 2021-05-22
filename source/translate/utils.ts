
export type ValueOf<T> = T[keyof T];

export type ConditionalKeys<Base, Condition> = NonNullable<{
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;
