var express = require('express');
var kutil = require('./util/kutil.js');
var wechat = require('wechat');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var client_id_secret = kutil.readJsonFromFile('./res/client_id_secret.json');
var wechat_app_config = kutil.readJsonFromFile('./res/wechat_app_config.json');

var bt = require('./util/bing-translate.js').init(client_id_secret);

var app = express();
app.listen(server_port, server_ip_address);

// welcome message
app.get('/', function (req, res) {
    res.send('welcome to kdict server');
});

// web API
app.get('/t/:word', function (req, res) {
    var input_word = req.param('word');
    bt.translate(input_word, 'en', 'zh-CHS', function (translate_err, translate_res) {
        if (translate_err) {
            res.writeHead(404);
            res.end(JSON.stringify(translate_err));
            return;
        }

        // to be added... save searched words in Mongo db
        //var currentDate = new Date();
        //addNewWord(text, currentDate);

        var translate_result = translate_res["translated_text"];
        res.writeHead(200);
        res.end(translate_result);
    });
});

// wechat API
app.use(express.query());
app.use('/wechat', wechat(wechat_app_config, function (req, res, next) {
    var message = req.weixin;
    if (message.MsgType == 'text') {
        var input_word = message.Content;

        bt.translate(input_word, 'en', 'zh-CHS', function (translate_err, translate_res) {
            if (translate_err) {
                res.reply({
                    content: 'translation error',
                    type: 'text'
                });
                return;
            }

            // to be added... save searched words in Mongo db
            //var currentDate = new Date();
            //addNewWord(text, currentDate);

            var translate_result = translate_res["translated_text"];
            res.reply({
                content: translate_result,
                type: 'text'
            });
        });
    }
}));