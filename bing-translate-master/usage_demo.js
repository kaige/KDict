var bt = require('./lib/bing-translate.js').init({
    client_id: 'my_client_id', 
    client_secret: 'my_client_secret'
  });

var word = process.argv[2];

bt.translate(word, 'en', 'zh-CHS', function(err, res){
  console.log(err, res);
});