# Plugins

## Custom Language Targets

1. Create a `<langauge>.rs` file
2. Inside the spec file:
```rs

#[no_mangle]
pub extern "C" fn extension() -> String {
  "js".to_string()
}

#[no_mangle]
pub extern "C" fn assign(id: &str, value: &str) -> String {
  format!("{} = {};", id, value)
}
```
3. Run with the target flag to add it: `sindarin --target=js --transpiler=./<langauge>.rs`

## Custom Data Types

1. Import a type from a `.<lang>.type.rs` file:

```
"boolean.js.type.rs" {
  Boolean
};
```

2. Define a few functions in your `.<lang>.type.rs` file:

```rs
#[repr(C)]
pub enum DataType {
  Boolean
}

#[no_mangle]
pub extern "C" fn get_type() -> DataType {
  DataType::Boolean
}

#[no_mangle]
pub extern "C" fn get_value(input: bool) -> String {
  if input == true {
    "true".to_string()
  } else {
    "false".to_string()
  }
}

#[no_mangle]
pub extern "C" fn unary(id: &str, operator: &str) -> String {
  match operator {
    "!" => format!("!{}", id),
    _ => panic!("Unknown unary operator: {}", operator)
  }
}

#[no_mangle]
pub extern "C" fn method(id: &str, name: &str) -> String {
  match name {
    "out" => format!("console.log({});", id),
    _ => panic!("Unknown method: {}", name)
  }
}
```
