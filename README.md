# 搭建node-server服务器
#### 可控制三个路由和静态页面
1. 根据路由规则匹配不同页面
- "/index" 
- "weather"  表单页面，使用ajax获取weather.jon中的城市天气数据
- "register" 使用ajax发送POST请求

2. 代码分析
封装路由对象
```
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
    }
}
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
```
路由处理函数
```
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

```
静态文件处理
```
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
```
创建服务器监听3000端口
```
    http.createServer(function (req, res) {
    routesHandle(req, res)
}).listen(3000, function () {
    console.log('running')
    console.log(__dirname)
})
```
