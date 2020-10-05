const Asset = require('../../../models/Asset')
const Model = require('../../../models/Model')
const StockItem = require('../../../models/StockItem')

module.exports.set = (app) => {

    let url = '/api/model'
    // Get All
    app.get(`${url}`, (req, res) => {
        Model.find().then((results) => {
            res.send(results)
        })
    })


    // Get Details
    app.get(`${url}/:_id`, (req, res) => {
        Model.findById(req.params._id).then(results => { res.send(results) })
    })

    // TODO Get Stats
    app.get(`${url}/:_id/stats`, (req, res) => {
        res.send('In Progress')
    })


    // Get Assets
    app.get(`${url}/:_id/assets`, (req, res) => {
        Asset.find({ model: req.params._id }).then(results => { res.send(results) })
    })

    // Get Stock Items
    app.get(`${url}/:_id/stockitems`, (req, res) => {
        StockItem.find({ model: req.params._id }).then(results => { res.send(results) })
    })


    // Get Locations 
    app.get(`${url}/:_id/locations`, async (req, res) => {

        Model.findById(req.params._id).then(async m => {
            let assetLocations = []
            if (m.isTracked) {
                let assets = await Asset.find({ model: req.params._id }).then(results => { return results })
                for (let i = 0; i < assets.length; i++) {
                    assetLocations.push({ asset: assets[i]._id, origin: assets[i].origin })
                }


                res.send({ assetLocations })
            } else {
                let stockLocations = []

                let stockitems = await StockItem.find({ model: req.params._id }).then(results => {
                    return results
                })
                for (let i = 0; i < stockitems.length; i++) {
                    if (stockitems[i].locationQuantity !== null) {
                        stockitems[i].locationQuantity.map(lq => {
                            stockLocations.push({ stockitem: stockitems[i]._id, location: lq.location })
                        })
                    }
                }
                res.send({ stockLocations })
            }
        })
    })

    // Create New 
    app.post(`${url}`, (req, res) => {
        let m = new Model({ ...req.body })
        m.save().then((result => { res.send(result) })).catch(err => { res.status(404).send(err) })
    })
    // Update Existing 
    app.put(`${url}/:_id`, (req, res) => {
        Model.findById(req.params._id).then(m => {
            if (m === null) {
                res.send('Invalid ID')
            } else {
                Model.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                    .then(result => {
                        res.send(result)
                    }).catch(err => {
                        res.status(404).send(err)
                    })
            }
        })
    })
}