// imports
const express = require('express')
const http = require('http')
const path = require('path')
const morgan = require('morgan')
// const bodyParser = require('body-parser')

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

// basic constants
const hostname = 'localhost'
const port = 3000

// create express app
const app = express()

// use middlewares
app.use(morgan('dev'))
// app.use(bodyParser.json())
app.use(express.json())

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

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