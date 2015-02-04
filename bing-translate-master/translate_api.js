var fs = require('fs');
var http = require('http');
var url = require('url');


fd = fs.openSync('client_id_secret.json', 'r');
var id_secret_str = "";
do {
    var buf = new Buffer(1024);
    buf.fill();
    var bytes = fs.readSync(fd, buf, null, 1024);
    if (bytes > 0)
        id_secret_str += buf.toString();

} while (bytes > 0);
fs.closeSync(fd);

var first_brace = id_secret_str.indexOf('{');
var last_brace = id_secret_str.indexOf('}');
var valid_json_str = id_secret_str.substring(first_brace, last_brace + 1);
var client_id_secret = JSON.parse(valid_json_str);
var bt = require('./lib/bing-translate.js').init(client_id_secret);

http.createServer(function (req, res) {

    var urlObj = url.parse(req.url, true, false);
    var path =urlObj.path;
    var subStrs = path.split('\/');

    if (subStrs.length == 3 && subStrs[1] == "api")
    {
        var word = subStrs[2];
        bt.translate(word, 'en', 'zh-CHS', function(translate_err, translate_res){
            if (translate_err)
            {
                res.writeHead(404);
                res.end(JSON.stringify(translate_err));
                return;
            }

            console.log(translate_res);
            var translate_result = translate_res["translated_text"];
            res.writeHead(200);
            res.end(translate_result);
        });
    }
    else {
        res.writeHead(404);
        res.end("API call error: please call by host:80/api/{word}");
        return;
    }
}).listen(80);