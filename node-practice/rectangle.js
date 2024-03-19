// try - catch attempt
module.exports = (x, y, callback) => {
    if(x <= 0 || y <= 0)
        setTimeout(() => callback(new Error('rectangle dimensions should be greater than 0')), 2000)
    else {
        setTimeout(() => callback({
            perimeter: () => (2*(x+y)),
            area: () => (x*y)
        }), 2000)
    }
}

// W1-callbacks-error-handling
// module.exports = (x, y, callback) => {
//     if(x <= 0 || y <= 0)
//         setTimeout(() => callback(new Error('rectangle dimensions should be greater than 0'), null), 2000)
//     else {
//         setTimeout(() => callback(null, {
//             perimeter: () => (2*(x+y)),
//             area: () => (x*y)
//         }), 2000)
//     }
// }

// W1-node-modules
// module.exports.perimeter = (x,y) => (2*(x+y))
// module.exports.area = (x,y) => (x*y)