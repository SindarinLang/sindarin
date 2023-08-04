
#[no_mangle]
pub extern "C" fn plugin_function(x: i32, y: i32) -> i32 {
    x + y
}

#[repr(C)]
pub enum DataType {
  Boolean
}

#[no_mangle]
pub extern "C" fn get_name() -> &'static str {
  "bool"
}

#[no_mangle]
pub extern "C" fn get_type() -> DataType {
  DataType::Boolean
}

// #[no_mangle]
// pub extern "C" fn get_operator(op: &str, id: &str) -> &'static str {
  
// }


use std::ffi::{CStr, CString};
use std::os::raw::c_char;

#[no_mangle]
pub extern "C" fn process_string(input: *const c_char) -> *mut c_char {
    let c_str = unsafe { CStr::from_ptr(input) };
    let string = c_str.to_string_lossy().into_owned();

    // Process the string, for example, to uppercase.
    let processed_string = string.to_uppercase();

    // We need to return a heap-allocated C string that the caller is
    // responsible for freeing.
    let c_string = CString::new(processed_string).unwrap();
    c_string.into_raw()
}

// Free a C string from Rust.
#[no_mangle]
pub extern "C" fn free_rust_string(s: *mut c_char) {
    unsafe {
        if s.is_null() { return }
        CString::from_raw(s)
    };
}

// ---

#[no_mangle]
pub extern "C" fn test_callback(callback: extern fn(i32) -> i32, value: i32) -> i32 {
    callback(value)
}

// ---

#[no_mangle]
pub extern "C" fn process_string2(input: &str) -> String {
  let processed_string = input.to_uppercase();
  processed_string
}


