# Imports

## Sindarin

### Imports
Import from another Sindarin module:
```
"./path/to/module.s" {
  myFn,
  MyType
};
```

When importing from a directory, the directory must contain a `directory/<directory>.s` file.

### Exports

```
@MyType = {
  a: Int32,
  b: Int32
};

@myFn = (a: Int32, b: Int32) => {
  a + b
};

@myExport = myFn;

@ {
  myFn,
  MyType
};
```

## Plugins

### Type Import
Since we are importing a type here, the path we're importing from must be JS, and must follow a certain format so that we know how to handle this type:
```
"./path/to/module.js" {
  Float64
};
```
```js
export const Float64 = {
  category: "float",
  targets: {
    javascript: {
      type: "number",
      operations: {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        // ...
      },
      methods: {
        sqrt: // ...
      }
    },
    llvm: //...
    rust: //...
  }
}
```

### Function / Value Import
In this case, since we are importing a value, we need to provide a type annotation:
```
MapFn = (fn: (a: A) => B, list: List<A>) => List<B>;

"./path/to/module.js" {
  map: MapFn
};
```

```js
export const map = (fn, list) => list.map(fn);
```
