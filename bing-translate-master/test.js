var bt = require('./lib/bing-translate.js').init({
    client_id: 'KaiDict', 
    client_secret: 'phDnZSuCNbEllESlYEwAK1wHsDy1It4NZIm/xYl9ch8='
  });

var word = process.argv[2];

bt.translate(word, 'en', 'zh-CHS', function(err, res){
  console.log(err, res);
});