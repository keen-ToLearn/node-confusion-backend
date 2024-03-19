const mongoose = require('mongoose')

const Dishes = require('./models/dishes')

const dbUrl = 'mongodb://localhost:27017/confusion'

const connect = mongoose.connect(dbUrl)

connect.then(db => {
    console.log('Connected to server')

    // instantiating Model with new document, then using document object to save
    let newDish = new Dishes({
        name: 'Uthapizza',
        description: 'test'
    })

    newDish.save()
        .then(dish => {
            console.log(dish)

            return Dishes.find({}).exec()
        })
        .then(dishes => {
            console.log(dishes)

            return Dishes.deleteMany({})
        })
        .then(() => (mongoose.connection.close()))
        .catch(err => console.log(err))

    // create method invokes Model instantiation and save processes
    Dishes.create({
        name: 'Uthapizza',
        description: 'test'
    })
        .then(dish => (Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'updated test', comments: [...dish.comments, {
                rating: 1,
                comment: 'Comment 1',
                author: 'Commentor 1'
            }] }
        }, { new: true }).exec()))
        .then(dish => {
            console.log(dish)

            dish.comments.push({
                rating: 5,
                comment: 'I\'m getting a sinking feeling!',
                author: 'Leonardo Di Carpaccio'
            })

            return dish.save()
        })
        .then((dish) => {
            console.log(dish)

            return Dishes.deleteMany({})
        })
        .then(() => (mongoose.connection.close()))
        .catch(err => console.log(err))
})