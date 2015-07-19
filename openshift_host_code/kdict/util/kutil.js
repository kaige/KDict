var fs = require('fs');

function readJsonFromFile (json_file_name) {
  var fd = fs.openSync(json_file_name, 'r');
  var token_str = "";
  do {
    var buf = new Buffer(1024);
    buf.fill();
    var bytes = fs.readSync(fd, buf, null, 1024);
    if (bytes > 0)
      token_str += buf.toString();

  } while (bytes > 0);
  fs.closeSync(fd);

  var first_brace = token_str.indexOf('{');
  var last_brace = token_str.indexOf('}');
  var valid_json_str = token_str.substring(first_brace, last_brace + 1);
  var jason_object = JSON.parse(valid_json_str);
  return jason_object;
}

exports.readJsonFromFile = readJsonFromFile;