const mongoose = require('mongoose')

const connect = (isTest) => {
    return new Promise((resolve, reject) => {
        let mongoose_config = {}
        let build = process.env.NODE_ENV

        switch (build) {
            case 'dev':
                let DB_NAME = isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME

                mongoose_config.url = `mongodb://${process.env.DB_HOST}:27017`
                mongoose_config.options = {
                    dbName: DB_NAME,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false
                }
                break;
            case 'prod':
                mongoose_config.url = `mongodb://${process.env.DB_HOST}:27017?authSource=admin`
                mongoose_config.options = {
                    dbName: process.env.DB_NAME,
                    user: process.env.DB_USER,
                    pass: process.env.DB_PASS,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false
                }
                break;
            default:
                throw new Error('Invalid Config')
        }

        mongoose
            .connect(mongoose_config.url, mongoose_config.options)
            .then((result) => {
                console.log(
                    `MongoDB- 
                \r  Host : ${result.connections[0].host}  
                \r  Port : ${result.connections[0].port}  
                \r  DB   : ${result.connections[0].name}`
                )


                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })

}


module.exports = { connect }
