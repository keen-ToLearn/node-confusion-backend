// imports
const express = require('express')
const http = require('http')
const path = require('path')
const morgan = require('morgan')
// const bodyParser = require('body-parser')

// basic constants
const hostname = 'localhost'
const port = 3000

// create express app
const app = express()

// use middlewares
app.use(morgan('dev'))
// app.use(bodyParser.json())
app.use(express.json())

// route specification for /dishes
app.all('/dishes', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // based on req.method
    // exact req, res will get passed to the next app.get/post etc
})

app.get('/dishes', (req, res, next) => {
    res.end('Will send all the dishes to you')
})

app.post('/dishes', (req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description)
})

app.put('/dishes', (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})

app.delete('/dishes', (req, res, next) => {
    res.end('Deleting all the dishes')
})

// route specification for /dishes/:dishId
app.get('/dishes/:dishId', (req, res, next) => {
    res.end('Will send the dish: ' + req.params.dishId + ' to you')
})

app.post('/dishes/:dishId', (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})

app.put('/dishes/:dishId', (req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n')
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description)
})

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting the dish: ' + req.params.dishId)
})

// serve static files
app.use(express.static(path.resolve(__dirname, 'public')))

// W1-express-introduction
// default request handler middleware
app.use((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><body><h1>This is an express server</h1></body></html>')
})

const server = http.createServer(app)

server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}`)
})