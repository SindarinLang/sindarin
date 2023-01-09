# Standard Library

Here are some examples of how we can build up more complex functions from the base language, which has no keywords.

## If

```
if = <T>(condition: Bool, then: T, else: T) => {
  @(condition ? then ! else);
};
```

## For

```
for = <T>(array: Array<T>, do: (item: T) => Void) => {
  do(array[0]);
  return for(array[1..], do);
};
```
