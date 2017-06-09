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

app.route('/chunkStream')

    .get(function (req, res) {
        console.log(req.url);
        console.log(`range:${req.headers.range}`);
        console.log(req.url);
        var file = fs.stat(`${__dirname}/public/video/VivaLaVida.mp4`,(err,stats)=>{
            if(err) {
                return res.sendStatus(404);
            }
            console.log(`stats:${stats.size}`)
            var range =req.headers.range;
            if(!range) {
                res.sendStatus(404);
                return;
            }
            var position = range.replace(/bytes=/,"").split("-");
            var start = parseInt(position[0],10);
            var total = stats.size;
            var end = position[1]?parseInt(position[1],10):total-1;
            var chunkSize =(end-start)+1;
            console.log(`chunkSize:   ${chunkSize}`)
            res.writeHead(206,{
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": "video/mp4"
            });
            var stream = fs.createReadStream(`${__dirname}/public/video/VivaLaVida.mp4`,{
                start,end
            })
                .on("open",()=>{
                    stream.pipe(res);
                })
                .on("close",()=>{
                    console.log("stream is close");
                })
        })
        // var range = req.range()[0];
        // res.sendFile(__dirname + "/public/video/VivaLaVida.mp4")
    });


app.route('/dashStream')
    .get(function (req, res, next) {
        var range = req.range()[0];
        var stream = fs.createReadStream(__dirname + "/public/video/VivaLaVida_dashinit.mp4", {
            start: range.start,
            end: range.end
        })
        var buffer = new Buffer(0);

        stream.on('data', function (chunk) {
            console.log(chunk.byteLength);
            buffer = Buffer.concat([buffer, chunk]);
        });
        stream.on('end', function () {
            console.log('end');
            res.send(buffer);
        })
    });
app.route('/')
    .get(function (req, res, next) {
        res.sendfile('./test/index.html');
    })
app.listen(3031);
