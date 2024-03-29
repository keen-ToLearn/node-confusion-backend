const express = require('express')
const cors = require('cors')

const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443']

var corsOptionsDelegate = (req, cb) => {
    var corsOptions
    
    if(whitelist.indexOf(req.header('Origin')) !== -1)
        corsOptions = { origin: true }
    else
        corsOptions = { origin: false }
    
    cb(null, corsOptions)
}

module.exports.cors = cors()
module.exports.corsWithOptions = cors(corsOptionsDelegate)