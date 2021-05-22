{
  "targets": [{
    "target_name": "addon",
    "cflags!": [
      "-std=c++17",
      "-fno-exceptions"
    ],
    "cflags_cc!": [
      "-fno-exceptions"
    ],
    "sources": [ # 
      "<!@(node -p \"require('read-dir-safe').readDirSync('./cpp').map(f=>'cpp/'+f).join(' ')\")"
    ],
    'include_dirs': [
      "<!@(node -p \"require('node-addon-api').include_dir\")"
    ],
    'dependencies': [
      "<!(node -p \"require('node-addon-api').gyp\")"
    ],
    'defines': [
      'NAPI_DISABLE_CPP_EXCEPTIONS'
    ]
  }]
}
