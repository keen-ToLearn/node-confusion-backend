const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)

const Schema = mongoose.Schema
const Currency = mongoose.Types.Currency

const promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Promotions = mongoose.model('Promotions', promoSchema)

module.exports = Promotions