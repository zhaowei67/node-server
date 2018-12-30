var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

//路由对象封装

var getRoutes = {
    "/index": function (req, res) {
        console.log(__dirname)
        fs.readFile(path.join(__dirname, 'static/views/index.html'), function (err, data) {
            if (err) {
                console.log("404 NOT FOUND")
            }
            res.end(data)
        })
    },
    "/weather": function (req, res) {
        fs.readFile(path.join(__dirname, 'static/views/weather.html'), function (err, data) {
            if (err) {
                console.log("404 NOT FOUND")
            }
            res.end(data)
        })
    },
    "/register": function (req, res) {
        fs.readFile(path.join(__dirname, 'static/views/register.html'), function (err, data) {
            if (err) {
                console.log("404 NOT FOUND")
            }
            res.end(data)
        })
    },
    "/getweather": function (req, res) {
        fs.readFile(path.join(__dirname, 'static/data/weather.json'), function (err, data) {
            if (err) {
                console.log("404 NOT FOUND")
            }
            var city = url.parse(req.url, true).query.city
            res.end(JSON.parse(data)[city])
        })
    }
}
// 
var postRoutes = {
    "/register": function (req, res) {
        var body = ''
        req.on('data', function (chunk) {
            console.log('chunk:' + chunk)
            body += chunk
        }).on('end', function () {
            req.body = parseBody(body)
            res.end(JSON.stringify(req.body))
        })

    }
}

function parseBody(body) {
    console.log(body)
    var obj = {}
    body.split('&').forEach(function (str) {
        obj[str.split('=')[0]] = str.split('=')[1]
    })
    return obj
}

//路由处理函数封装
function routesHandle(req, res) {
    var pathname = url.parse(req.url).pathname
    if (pathname === "/") {
        pathname += "index"
    }
    if (getRoutes[pathname] && req.method === "GET") {
        getRoutes[pathname](req, res)
    } else if (postRoutes[pathname] && req.method === "POST") {
        postRoutes[pathname](req, res)
    }else {
        staticRoot(req, res)
    }
}

//静态文件处理
function staticRoot(req, res) {
    fs.readFile(path.join(__dirname, "static", req.url),function (err, data) {
        if (err) {
            res.writeHead('404', 'Not Found')
            res.end()
        } else{
            res.end(data)
        }       
    })
}

http.createServer(function (req, res) {
    routesHandle(req, res)
}).listen(3000, function () {
    console.log('running')
    console.log(__dirname)
})