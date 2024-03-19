const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = 'localhost'
const port = 3000

const server = http.createServer((req, res) => {
    console.log('Request for ' + req.url + ' by method ' + req.method)

    // W1-node-http
    if(req.method == 'GET') {
        let fileUrl = (req.url == '/' ? '/httpIndex.html' : req.url)
        let filePath = path.resolve('.' + fileUrl)
        const fileExt = path.extname(filePath)

        if(fileExt == '.html') {
            fs.access(filePath, (err) => {
                if(err) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html')
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>')

                    return
                }
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html')
                fs.createReadStream(filePath).pipe(res)
            })
        }
        else {
            res.statusCode = 400
            res.setHeader('Content-Type', 'text/html')
            res.end('<html><body><h1>Error 400: ' + fileUrl + ' not html file</h1></body></html>')
        }
    }
    else {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><body><h1>Error 403: ' + req.method + ' not allowed</h1></body></html>')
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})