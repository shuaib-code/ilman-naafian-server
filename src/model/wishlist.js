const { Schema, model } = require("mongoose");

const readListSchema = new Schema({
    "bookName": String,
    "author": String,
    "pub": String,
    "cat": String,
    "url": String
})

const readList = model('readlist', readListSchema)

module.exports = readList