const mongoose = require('mongoose')

const Schema = mongoose.Schema

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    dishes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dishes'
    }]
}, {
    timestamps: true
})

const Favorites = mongoose.model('Favorites', favoriteSchema)

module.exports = Favorites