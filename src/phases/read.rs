use std::fs;
use std::path::Path;

pub fn read(path: &Path) -> Result<String, std::io::Error> {
  fs::read_to_string(path)
}
