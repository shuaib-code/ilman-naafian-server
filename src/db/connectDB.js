const { connect } = require('mongoose');

require('dotenv').config()
const connectDB = async() => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5sxqgi.mongodb.net/?retryWrites=true&w=majority`;

    console.log('connecting to DB...')

    await connect(uri, { dbName: process.env.DB_NAME });
    console.log('Connected to DB!')
}

module.exports = connectDB