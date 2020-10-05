const User = require('../../../models/User')

module.exports.set = (app) => {

    let url = '/api/user'
    // TODO
    // Get All
    app.get(`${url}`, (req, res) => {
        User.find().then(results => { res.send(results) })
    })


    // Get Details

    // Get Assets

    // Get Stock Items

    // Get Attachments

    // Get History

    // Create New 

    // Update Existing 

}