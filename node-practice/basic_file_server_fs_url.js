const http = require('http')
const url = require('url')
const fs = require('fs')

http.createServer((req, res) => {
    let target = url.parse(req.url, true)
    fs.readFile('.' + target.pathname, (err, data) => {
        if(err) {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 Not Found')
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data)
            res.end()
        }
    })
}).listen(8080)