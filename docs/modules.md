# Modules

- [Sindarin.json](#sindarinjson)
- [Exports](#exports)
  - [Grouped Exports](#grouped-exports)
  - [Nested Exports](#nested-exports)
- [Imports](#imports)
  - [Import Sources](#import-sources)
    - [Named Modules](#named-modules)
    - [Relative Modules](#relative-modules)
    - [URL Imports](#url-imports)
    - [C Imports](#c-imports)
  - [Reexports](#reexports)
  - [Relative Modules](#relative-modules)
  - [Nested Imports](#nested-imports)
  - [Wildcard Imports](#wildcard-imports)
  - [Wildcard Reexports](#wildcard-reexports)

## _Sindarin.json_

Sindarin modules are declared in `sindarin.json`:

```json
{
  "name": "myModule",
  "version": "1.0.0",
  "main": "src/index.si",
  "dependencies": {
    "sindarin": "1.0.0",
    "other-library-from-git": "https://github.com/my-user/repo-name",
    "relative-alias": "./relative/path/to/module",
    "c-import": "<stdio.h>"
  }
}
```

## _Exports_

To export a variable or function, simply prefix it with the `@` operator:

```
myPrivateVar = 5;

myPrivateFn = () => {
  return 5;
};

@myPublicVar = 5;

@myPublicFn = () => {
  return 5;
};
```
### _Grouped Exports_

Alternatively, you can group module exports:

```
@ {
  myPublicVar,
  myPublicFn
};
```

### _Nested Exports_

Modules can also be nested under a namespace for better organization:

```
@ {
  subModule {
    myPublicVar,
    myPublicFn
  }
};
```

## _Imports_

### _Import Sources_

#### _Named Modules_

Modules that are declared in `sindarin.json` can be imported by name:

```
sindarin {
  out
};
```

> In this case, `sindarin` refers to the Sindarin standard library

#### _Relative Modules_

You can also import modules relative to the current file:

```
"../path/to/module.si" {
  myFn
};
```

#### _URL Imports_

You can import modules from a URL:

```
"https://github.com/my-user/repo-name" {
  myFn
};
```

#### _C Imports_

You can also import C libraries:

```
<stdio.h> {
  printf
};
```

### _Reexports_

Modules can also be re-exported during import:
```
sindarin {
  @out
};
```

### _Nested Imports_

Modules can also be nested:
```
"../path/to/module.si" {
  subModule {
    myFn
  }
};
```

### _Wildcard Imports_
```
sindarin.*;

"../path/to/module.si" {
  subModule.*
};
```

### _Wildcard Reexports_
You can also reexport with wildcards:
```
@sindarin.*;

"../path/to/module.si" {
  @subModule.*
};
```
