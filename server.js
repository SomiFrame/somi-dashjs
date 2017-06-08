var express = require('express');
var app = express();
var fs = require('fs');

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    console.log(req.headers.range);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,range');
    next();
}
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/views");
app.set("view engine", express);


var options = {
    root: __dirname + '/public/'
};

app.route('/dashStream')
    .get(function (req, res, next) {
        console.log(req.range());
        var range = req.range()[0];
        var stream = fs.createReadStream(__dirname + "/public/video/VivaLaVida_dashinit.mp4", {
            start: range.start,
            end: range.end
        })
        var buffer = new Buffer(0);

        stream.on('data', function (chunk) {
            console.log(chunk.byteLength);
            buffer = Buffer.concat([buffer,chunk]);
        });
        stream.on('end', function () {
            console.log('end');
            res.send(buffer);
        })
        console.log("output",buffer.toString());
    });
app.route('/')
    .get(function (req, res, next) {
        res.sendfile('./test/index.html');
    })
app.listen(3031);