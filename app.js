//处理文件上传页面
var fs = require('fs'),

    express = require('express'),
    formidable = require("formidable"),

    Q = require('./lib/Q.js'),
    app = express();

app.use(express.static('./www'));

app.get('/', function (req, res) {
    res.redirect("/demo/default.html");
});

function process_upload_file(req, res, callback) {
    var form = new formidable.IncomingForm();

    form.uploadDir = "upload";
    form.maxFieldsSize = 2 * 1024 * 1024 * 1024;  //2G

    form.parse(req, function (err, fields, files) {
        var upfile;

        Object.forEach(files, function (key, file) {
            upfile = file;
        });

        callback && callback(form, upfile, fields);
    });
}

function finish_upload(req, res, fields) {
    var result = {
        time: Date.now(),
        type: req.query["type"],
        user: fields["user"],
        name: fields["name"]
    };

    res.send(JSON.stringify(result));
}

app.all('/upload', function (req, res) {
    var action = req.query["action"],
        hash = req.query["hash"];

    if (!hash) {
        process_upload_file(req, res, function (form, file, fields) {
            var fileName = fields["fileName"];
            fs.rename(file.path, form.uploadDir + "/" + (fileName || file.name));

            finish_upload(req, res, fields);
        });
    } else {
        var path = "upload/" + hash,
            path_ok = path + ".ok";

        if (action == "query") {
            if (fs.existsSync(path_ok)) res.send('ok'); //秒传成功可以返回json对象 eg:{ ret:1, test:"aaa" }
            else if (fs.existsSync(path)) res.send(fs.statSync(path).size + "");//等同于 { ret:0,start:fs.statSync(path).size }
            else res.send("0"); //等同于 { ret:0,start:0 }
        } else {
            process_upload_file(req, res, function (form, file, fields) {
                fs.appendFileSync(path, fs.readFileSync(file.path));
                fs.unlink(file.path);

                var isOk = req.query["ok"] == "1";
                if (!isOk) {
                    res.send("1");
                } else {
                    fs.rename(path, path_ok);
                    finish_upload(req, res, fields);
                }
            });
        }
    }
});

app.listen(3000, function () {
    console.log("server running at 127.0.0.1:3000");
    console.log();
});