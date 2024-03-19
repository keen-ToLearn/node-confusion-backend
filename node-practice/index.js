// W1-node-modules
// var rect = {
//     perimeter: (x,y) => (2*(x+y)),
//     area: (x,y) => (x*y)
// };

var rect = require('./rectangle');

function solveRect(l,b) {
    console.log('solving for rectangle with l = ' + l + ', b = ' + b);

    // try - catch attempt
    rect(l, b, (arg) => {
        try {
            console.log('area = ' + arg.area())
            console.log('perimeter = ' + arg.perimeter())
        } catch (err) {
            console.log(arg.message)
            console.log(err.message) // arg.area is not a function
        }
    });

    // W1-callbacks-error-handling
    // rect(l, b, (err, ops) => {
    //     if(err)
    //         console.log(err.message)
    //     else {
    //         console.log('area = ' + ops.area())
    //         console.log('perimeter = ' + ops.perimeter())
    //     }
    // });

    console.log('post rect call with l = ' + l + ', b = ' + b);

    // W1-node-modules
    // if(l <= 0 || b <= 0)
    //     console.log('rectangle dimensions should be greater than 0');
    // else {
    //     console.log('area = ' + rect.area(l,b));
    //     console.log('perimeter = ' + rect.perimeter(l,b));
    // }
}

solveRect(5,7);
solveRect(2,4);
solveRect(0,7);
solveRect(1,-9);