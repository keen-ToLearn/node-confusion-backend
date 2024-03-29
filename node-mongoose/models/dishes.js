const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [ commentSchema ]
}, {
    timestamps: true
})

// export either after assigning to const/var
// const Dishes = mongoose.model('Dishes', dishSchema)

// module.exports = Dishes

// or directly
module.exports = mongoose.model('Dishes', dishSchema)