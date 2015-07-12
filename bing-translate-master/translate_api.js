var fs = require('fs');
var express = require('express');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var wechat = require('wechat');
var kutil = require('./lib/k-util.js');

var client_id_secret = kutil.readJasonFromFile('../client_id_secret.json');
var wechat_app_config = kutil.readJasonFromFile('../wechat_app_config.json');
var bt = require('./lib/bing-translate.js').init(client_id_secret);
    
var app = express();
app.listen(80);

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

// local test API for Bing translator
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

// wechat app API
app.get('/wechat', wechat(wechat_app_config, function (req, res, next) {
    var message = req.weixin;
    if (message.MsgType == 'text') {
        var text = message.Content;
        
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
        
    }
    
}));