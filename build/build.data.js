//build 配置文件
module.exports = {
    root: "../",

    noStore: true,

    copy: {
        title: "同步 web-uploader 内容",
        dir: "../web-uploader",
        match: ["js/*.js", "css/*.css", "images/*", "demo/*", "dist/**", "*.all.js"],
        output: "www"
    },

    format: {
        title: "修改demo.js上传路径",
        match: "www/demo/demo.js",
        autoSkip: false,
        replace: [
            ["../api/upload.ashx", "/upload"]
        ]
    },

    run: ["copy", "format"]
};