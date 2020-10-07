const StockItem = require('../../../models/StockItem')
const User = require('../../../models/User')
const { body, validationResult, param } = require('express-validator')

module.exports.set = (app) => {

    let url = '/api/stockitem'
    // Get All
    app.get(`${url}`, (req, res) => {
        StockItem.find().populate(['model', 'locationQuantity.location']).then(results => { res.send(results) })
    })

    // Get Details

    app.get(`${url}/:_id`, (req, res) => {
        StockItem.findById(req.params._id).populate(['model', 'locationQuantity.location', 'userQuantity.user'])
            .then(results => {
                res.send(results)
            })
    })

    // Get Locations
    app.get(`${url}/:_id/locations`, (req, res) => {
        StockItem.findById(req.params._id).populate(['locationQuantity.location']).then(results => {
            res.send(results.locationQuantity)
        })
    })
    // Get History
    app.get(`${url}/:_id/history`, (req, res) => {
        //TODO Get History
    })

    // Get Stats
    app.get(`${url}/:_id/stats`, (req, res) => {
        //TODO Get Stats
    })

    // Create New 
    app.post(`${url}`, (req, res) => {
        let s = new StockItem({ ...req.body })
        s.save().then(result => { res.send(result) }).catch(err => { res.status(404).send(err) })
    })

    // Update Existing 
    app.put(`${url}/:_id`, (req, res) => {

        if (req.body.locationQuantity) {
            res.status(403).send('Forbidden')
        } else {
            StockItem.findById(req.params._id).then(s => {
                if (s === null) {
                    res.send('Invalid ID')
                } else {
                    StockItem.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                        .then(result => {
                            res.send(result)
                        }).catch(err => {
                            res.status(404).send(err)
                        })
                }
            })
        }
    })

    // Issue Stock Item to User
    app.post(`${url}/:_id/issue`, [
        param('_id').isMongoId(),
        body(['user', 'location']).isMongoId(),
        body('quantity').isInt({ gt: 0 })
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        User.findById(req.body.user).then((u) => {
            if (u === null) { return res.status(400).send('Invalid User ID ') }

            StockItem.findById(req.params._id).then(s => {
                if (!s.userQuantityExists(u._id)) {
                    s.addUserQuantity(u._id, req.body.quantity).then(result => {
                        result.decrementLocationQuantity(req.body.location, req.body.quantity)
                            .then(async finalResult => {
                                return res.send(await finalResult.save())
                            }).catch(err => { return res.status(404).send(err) })
                    }).catch(err => { return res.status(404).send(err) })
                } else {
                    s.incrementUserQuantity(u._id, req.body.quantity).then(result => {
                        result.decrementLocationQuantity(req.body.location, req.body.quantity)
                            .then(async finalResult => {
                                u.issueStockItem(finalResult._id, req.body.quantity)
                                return res.send(await finalResult.save())
                            }).catch(err => { return res.status(404).send(err) })
                    }).catch(err => { return res.status(404).send(err) })
                }
            }).catch(err => { return res.status(404).send(err) })
        }).catch(err => { return res.status(404).send(err) })
    })

    // Return Stock Item from User
    app.post(`${url}/:_id/return`, [
        param('_id').isMongoId(),
        body(['user', 'location']).isMongoId(),
        body('quantity').isInt({ gt: 0 })
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        User.findById(req.body.user).then((u) => {
            if (u === null) { return res.status(400).send('Invalid User ID ') }
            StockItem.findById(req.params._id).then(async s => {
                s.decrementUserQuantity(req.body.user, req.body.quantity).then(result1 => {
                    result1.incrementLocationQuantity(req.body.location, req.body.quantity)
                        .then(async finalResult => {
                            u.returnStockItem(finalResult._id, req.body.quantity)
                            return res.send(await finalResult.save())
                        }).catch(err => { return res.status(404).send(err) })
                }).catch(err => { return res.status(404).send(err) })
            })
        })
    })

    // Add New location and quantity
    app.post(`${url}/:_id`, [
        param('_id').isMongoId(),
        body('location').isMongoId(),
        body('quantity').isInt({ gt: -1 })
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        StockItem.findById(req.params._id).then(async s => {
            s.addLocationQuantity(req.body.location, req.body.quantity).then(async updated_StockItem => {
                let result = await updated_StockItem.save()
                res.send(result)
            }).catch(err => { res.status(404).send(err) })
        })
    })

}

// s.addLocationQuantity(req.body.location, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.removeLocationQuantity(req.body.location).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.incrementLocationQuantity(req.body.location, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.decrementLocationQuantity(req.body.location, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.addUserQuantity(req.body.user, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.removeUserQuantity(req.body.user, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.incrementUserQuantity(req.body.user, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })

// s.decrementUserQuantity(req.body.user, req.body.quantity).then(async updated_StockItem => {
//     let result = await updated_StockItem.save()
//     res.send(result)
// }).catch(err => { res.status(404).send(err) })