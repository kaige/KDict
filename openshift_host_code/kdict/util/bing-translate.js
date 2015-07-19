var https = require('https'),
  http = require('http'),
  querystring = require('querystring'),
  fs = require('fs'),
  kutil = require('./kutil.js'),
  client = {},
  credentials = {},
  regx = /<string [a-zA-Z0-9=":/.]+>(.*)<\/string>/;

exports.init = function (creds) {
    client.credentials = creds;
    return client;
}

client.setCredentials = function (creds) {
    client.credentials = creds;
}

client.translate = function (text, from, to, callback) {
    client.getToken(client.credentials, function (err, token) {
        var req = http.request({
            host: 'api.microsofttranslator.com',
            port: 80,
            path: '/V2/Http.svc/Translate?text=' + encodeURIComponent(text) + '&from=' + from + '&to=' + to + '&contentType=text/plain',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token.access_token
            }
        });
        req.on('response', function (response) {
            var data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                callback(null, {
                    original_text: text,
                    translated_text: regx.exec(data)[1],
                    from_language: from,
                    to_language: to
                });
            });
        });
        req.on('error', function (e) {
            callback(new Error(e.message), null);
        });
        req.end();
    });
}

client.token = {};
var cached_token_file = "./cached_token.txt";

client.isTokenExpired = function () {
    if (!fs.existsSync(cached_token_file))
        return true;

    var cached_token = kutil.readJsonFromFile(cached_token_file);

    var d = new Date();
    var currentTime = d.getTime() / 1000;
    if (currentTime - cached_token.got_time > cached_token.expires_in) {
        return true;
    }
    else {
        client.token = cached_token;
        return false;
    }
}


client.getToken = function (credentials, callback) {
    if (!client.isTokenExpired()) {
        callback(null, client.token);
        return;
    }

    var post_data = querystring.stringify({
        'grant_type': 'client_credentials',
        'scope': 'http://api.microsofttranslator.com',
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret
    });
    var req = https.request({
        hostname: 'datamarket.accesscontrol.windows.net',
        port: 443,
        path: '/v2/OAuth2-13/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        },
    }, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (response) {

            var token = JSON.parse(response);
            var d = new Date();
            token.got_time = d.getTime() / 1000;

            var token_str = JSON.stringify(token);

            // write token to file
            var options = { encoding: 'utf8', flag: 'w' };
            fs.writeFile(cached_token_file, token_str, options, function (err) {
                if (err) {
                    console.log("Cached Token Write Failed.");
                } else {
                    console.log("Cached Token Saved.");
                }
            });

            callback(null, token);
        });
    });
    req.on('error', function (e) {
        callback(new Error(e.message), null);
    });
    req.write(post_data);
    req.end();
}