const url = require('url')

var addr = 'https://www.google.com/search?q=uniform+civil+code'
var q = url.parse(addr, true)

console.log(q.protocol + '\n' + q.hostname + '\n' +
    q.pathname + '\n' + q.search + '\n_______________\n' +
    q.host + '\n' + q.path)
console.log(q.query)