var crypto = require('crypto');

var mykey = crypto.createCipheriv('aes-128-ecb', 'mypasswordistiny', null);
var mystr = mykey.update('abc', 'utf8', 'hex')
mystr += mykey.final('hex');
console.log(mystr);

mykey = crypto.createDecipheriv('aes-128-ecb', 'mypasswordistiny', null);
mystr = mykey.update('cb212473c0b164dc629bba79f7368b60', 'hex', 'utf8')
mystr += mykey.final('utf8');

console.log(mystr);