const express = require('express');
const globalError = require('./utils/globalError');
const connectDB = require('./db/connectDB');
const applyMiddleware = require('./middleware/applyMiddleware');
const router = require('./router/collected');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

applyMiddleware(app);
app.use(router);




// error & listen handle
app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl}`)
    error.status = 404
    next(error)
})
app.use(globalError);

const runServer = async () => {
    await connectDB()
    app.listen(port, ()=> console.log(`Server is running in ${port}.`))
}

runServer()