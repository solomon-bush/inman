const Asset = require('../../../models/Asset')
const Location = require('../../../models/Location')
const StockItem = require('../../../models/StockItem')
const User = require('../../../models/User')

module.exports.set = (app) => {

    let url = '/api/location'
    // Get All
    app.get(`${url}`, (req, res) => {
        Location.find().then((results) => {
            res.send(results)
        })
    })


    // Get Details
    app.get(`${url}/:_id`, (req, res) => {
        Location.findById(req.params._id).then(results => { res.send(results) })
    })

    // TODO Get Stats
    app.get(`${url}/:_id/stats`, (req, res) => {
        res.send('In Progress')
    })

    // Get Location Assets
    app.get(`${url}/:_id/assets`, (req, res) => {
        Asset.find({ origin: req.params._id }).then(results => { res.send(results) })
    })

    // Get Location StockItems
    // Returns array of StockItem_Ids with their quanity in that location
    app.get(`${url}/:_id/stockitems`, (req, res) => {
        StockItem.find().then(results => {
            let stockItems = []

            if (results !== null) {
                results.map((stockItem) => {
                    for (let i = 0; i < stockItem.locationQuantity.length; i++) {
                        if (String(stockItem.locationQuantity[i].location) === String(req.params._id)) {
                            stockItems.push({ _id: stockItem._id, quantity: stockItem.locationQuantity[i].quantity })
                        }
                    }
                })
                res.send(stockItems)
            } else { res.send([]) }
        })
    })

    // Get Location Users
    // Returns array of User_ids that are assigned to that location
    app.get(`${url}/:_id/users`, (req, res) => {
        User.find({ location: req.params._id }).then(results => {
            res.send(results)
        })
    })

    // Create New 
    app.post(`${url}`, (req, res) => {
        let l = new Location({ ...req.body })
        l.save().then((result => { res.send(result) })).catch(err => { res.status(404).send(err) })
    })
    // Update Existing 
    app.put(`${url}/:_id`, (req, res) => {
        Location.findById(req.params._id).then(l => {
            if (l === null) {

            } else {
                Location.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                    .then(result => {
                        res.send(result)
                    }).catch(err => {
                        res.status(404).send(err)
                    })
            }
        })
    })

}