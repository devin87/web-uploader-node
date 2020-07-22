//处理文件上传页面
var fs = require('fs'),
  path = require('path'),

  express = require('express'),
  formidable = require("formidable"),

  Q = require('./lib/Q.js'),
  app = express();

var NODE_DIR = __dirname,
  WWW_DIR = path.join(NODE_DIR, '../www'),
  UPLOAD_DIR = path.join(NODE_DIR, '../upload');

if (fs.existsSync(WWW_DIR)) app.use(express.static(WWW_DIR));

Q.mkdir(UPLOAD_DIR);

app.get('/', function (req, res) {
  res.redirect("/demo/default.html");
});

function process_upload_file(req, res, callback) {
  var form = new formidable.IncomingForm();

  form.uploadDir = UPLOAD_DIR;
  form.maxFieldsSize = 4 * 1024 * 1024 * 1024;  //2G

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
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method == 'OPTIONS') {
    res.send('1');
    return;
  }

  var action = req.query["action"],
    hash = req.query["hash"];

  if (!hash) {
    process_upload_file(req, res, function (form, file, fields) {
      var fileName = fields["fileName"] || file.name,
        savePath = path.join(UPLOAD_DIR, fileName),
        dir = path.dirname(savePath);

      if (dir && dir != '.') Q.mkdir(dir);

      fs.renameSync(file.path, savePath);
      console.log('Upload: ' + fileName + '  =>  ' + Q.formatSize(file.size));

      finish_upload(req, res, fields);
    });
  } else {
    var path_tmp = path.join(UPLOAD_DIR, hash),
      path_ok = path_tmp + ".ok";

    if (action == "query") {
      if (fs.existsSync(path_ok)) res.send('ok'); //秒传成功可以返回json对象 eg:{ ret:1, test:"aaa" }
      else if (fs.existsSync(path_tmp)) res.send(fs.statSync(path_tmp).size + "");//等同于 { ret:0,start:fs.statSync(path_tmp).size }
      else res.send("0"); //等同于 { ret:0,start:0 }
    } else {
      process_upload_file(req, res, function (form, file, fields) {
        if (fields["retry"] != "1") fs.appendFileSync(path_tmp, fs.readFileSync(file.path));
        fs.unlinkSync(file.path);

        var isOk = req.query["ok"] == "1";
        if (!isOk) {
          res.send(fields["retry"] == "1" ? "0" : "1");
        } else {
          var fileName = fields["fileName"] || file.name;
          fs.renameSync(path_tmp, path_ok);
          console.log('Upload: ' + fileName + '  =>  ' + Q.formatSize(fs.statSync(path_ok).size));

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