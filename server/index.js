//DEPENDENCIES
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

//LOCAL
const db = require('./src/db');
const routes = require('./src/api/routes')

// //MODELS
// //Load Models
// const Location = require('./src/models/Location');
// const Category = require('./src/models/Category');
// const Model = require('./src/models/Model');
// const Manufacturer = require('./src/models/Manufacturer');
// const User = require('./src/models/User');
// const Asset = require('./src/models/Asset');
// const StockItem = require('./src/models/StockItem');
// const Attachment = require('./src/models/Attachment');

const app = express()
app.use(bodyParser.urlencoded())
db.connect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`INMAN Server running at http://localhost:${process.env.PORT}`)
        routes.set(app)
    })
}).catch(err => { throw new Error(err) })







