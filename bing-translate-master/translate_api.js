var fs = require('fs');
var express = require('express');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var app = express();
app.listen(80);

var fd = fs.openSync('../client_id_secret.json', 'r');
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

function addNewWord(word, date)
{
    MongoClient.connect("mongodb://localhost/", function(err, db) {
        if (err){
            console.log("data base connection error");
        }

        var newWordDB = db.db("KDict");
        newWordDB.collection("default", function(err, coll){
            if (err) {
                console.log("find collection error");
            }
            coll.findAndModify(
                {newWord: word},
                [['newWord', 1]],
                {$push: {searchDate: date}},
                {w:1, new: true, upsert:true},
                function(err, doc) {
                    newWordDB.close();
                    console.log("data base closed");
                }
            );
        });
    });
}

app.get('/api/:word', function(req, res) {
    var text = req.param('word');
    bt.translate(text, 'en', 'zh-CHS', function(translate_err, translate_res){
            if (translate_err)
            {
                res.writeHead(404);
                res.end(JSON.stringify(translate_err));
                return;
            }

            console.log(translate_res);

            var currentDate = new Date();
            addNewWord(text, currentDate);

            var translate_result = translate_res["translated_text"];
            res.writeHead(200);
            res.end(translate_result);
        });
});