const { model, Schema } = require("mongoose")

const collectedSchema = new Schema({
    "bookName": String,
    "author": String,
    "pub": String,
    "cat": String,
    "islamic": String,
    "url": String
})

const collected = model('collected', collectedSchema)

module.exports = collected