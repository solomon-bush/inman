const Manufacturer = require('../../../models/Manufacturer')

module.exports.set = (app) => {

    let url = '/api/manufacturer'
    // TODO
    // Get All
    app.get(`${url}`, (req, res) => {
        Manufacturer.findById().then((results) => {
            res.send(results)
        })
    })


    // Get Details

    // Get Stats


    // Create New 

    // Update Existing 

}