# Standard Library

Here are some examples of how we can build up more complex functions from the base language, which has no keywords.

## Types

### Void
```
Void;
```

## Constants

```
void: Void;
```

## Functions

### If

```
if = <T>(condition: Bool, then: T, else: T) => {
  condition ? then ! else
};
```

### For

```
for = <T>(array: T[], do: (item: T) => Void) => {
  do(array[0]);
  for(array[1..], do)
};
```

### While

```
while = <T>(condition: Bool, do: (item: T) => Void) => {
  condition
    ? do()->while(condition, do)
    ! void
};
```

### Do While

```
doWhile = <T>(do: (item: T) => Void, condition: Bool) => {
  do()->while(condition, do)
};
```
