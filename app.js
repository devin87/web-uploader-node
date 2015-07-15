//处理文件上传页面
var http = require('http'),
    express = require('express'),

    Q = require('./lib/Q.js'),

    app = express();

app.use(express.static('./www'));
app.use(express.bodyParser({ uploadDir: './upload', limit: '2000mb' }));

app.get('/', function (req, res) {
    res.redirect("/demo/default.html");
});

app.post('/upload', function (req, res) {
    Object.forEach(req.files, function (k, f) {
        var path = f.path,
            fileName = f.name;

        console.log(fileName + " => " + path + "     | " + Q.formatSize(f.size));
    });

    var user = req.body["user"],
        name = req.body["name"];

    res.send(JSON.stringify({ time: Date.now(), user: user, name: name }));
});

var server = http.createServer(app);

server.listen(3000, function () {
    var addr = server.address();
    console.log();
    console.log("server running at " + addr.address + ":" + addr.port);
    console.log();
});