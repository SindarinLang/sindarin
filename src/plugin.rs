use std::process::Command;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;
use libloading::{Library, Symbol};
use std::fs;
use std::io::Read;
use std::error::Error;

// Calculate a hash of the source file's content
fn calculate_hash<T: Hash>(t: T) -> u64 {
  let mut s = DefaultHasher::new();
  t.hash(&mut s);
  s.finish()
}

// Compile a Rust source file into a dynamic library
fn compile_plugin(source_path: &str, target_path: &str) -> Result<(), Box<dyn Error>> {
  let output = Command::new("rustc")
      .arg("--crate-type")
      .arg("cdylib")
      .arg("-o")
      .arg(target_path)
      .arg(source_path)
      .output()?;
  if !output.status.success() {
      return Err(From::from("Failed to compile plugin"));
  }
  Ok(())
}

// Dynamically load a plugin from a compiled library
unsafe fn load_plugin(library_path: &str) -> Result<Library, libloading::Error> {
  libloading::Library::new(library_path)
}

#[repr(C)]
pub enum DataType {
  Boolean
}

impl std::fmt::Debug for DataType {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      DataType::Boolean => write!(f, "Boolean")
    }
  }
}

use std::ffi::{CStr, CString};
use std::os::raw::c_char;

extern fn callback(x: i32) -> i32 {
  x * 2
}

fn main() -> Result<(), Box<dyn Error>> {
  let source_path = "/Users/connorwhite/dev/sindarin/sindarin-rs/src/plugin.rs";
  let mut source_content = String::new();
  fs::File::open(source_path)?.read_to_string(&mut source_content)?;
  let hash = calculate_hash(&source_content);

  let target_path = format!("/tmp/plugin-{}.so", hash);

  compile_plugin(source_path, &target_path)?;
  let lib = unsafe { load_plugin(&target_path)? };

  // let plugin_function: Symbol<unsafe extern "C" fn(i32, i32) -> i32> = unsafe { lib.get(b"plugin_function").unwrap() };
  // let result = unsafe { plugin_function(2, 3) };

  // let get_type: Symbol<unsafe extern "C" fn() -> DataType> = unsafe { lib.get(b"get_type").unwrap() };
  // let result = unsafe { get_type() };

  // let get_name: Symbol<unsafe extern "C" fn() -> &'static str> = unsafe { lib.get(b"get_name").unwrap() };
  // let result = unsafe { get_name() };

  // let process_string: Symbol<unsafe extern "C" fn(*const c_char) -> *mut c_char> = unsafe { lib.get(b"process_string").unwrap() };
  // let free_rust_string: Symbol<unsafe extern "C" fn(*mut c_char)> = unsafe { lib.get(b"free_rust_string").unwrap() };
  // let input = CString::new("Hello, world!").unwrap();
  // let result_ptr = unsafe { process_string(input.as_ptr()) };  // save the returned pointer
  // let result_str = unsafe { CStr::from_ptr(result_ptr).to_string_lossy().into_owned() };  // create a Rust String for use
  // println!("{}", result_str);  // use the string
  // unsafe { free_rust_string(result_ptr) };  // then free the memory
  
  // let test_callback: Symbol<unsafe extern "C" fn(extern fn(i32) -> i32, i32) -> i32> = unsafe { lib.get(b"test_callback").unwrap() };
  // let result = unsafe { test_callback(callback, 10) };
  // println!("{}", result);

  let process_string: Symbol<unsafe extern "C" fn(&str) -> String> = unsafe { lib.get(b"process_string2").unwrap() };
  let input = CString::new("hello").unwrap();
  let input_str = input.to_str().unwrap();
  let result_string = unsafe { process_string(input_str) };
  println!("{}", result_string);

  Ok(())
}
