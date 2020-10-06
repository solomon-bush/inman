const StockItem = require('../../../models/StockItem')
const User = require('../../../models/User')
const { body, validationResult, param } = require('express-validator')
const { isValidObjectId } = require('mongoose')


/*
    TODO:
    - Finish Generic routes
    - Add logic to assign stockItem quantities to users
    - Add logic to unassign/return stockItem quantities to users
*/
module.exports.set = (app) => {

    let url = '/api/stockitem'
    // Get All
    app.get(`${url}`, (req, res) => {
        StockItem.find().populate(['model', 'locationQuantity.location']).then(results => { res.send(results) })
    })

    // Get Details

    app.get(`${url}/:_id`, (req, res) => {
        StockItem.findById(req.params._id).populate(['model']).then(results => {
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
        //1. Check User is Valid User
        //2. Check Location Has Valid Quantity
        //3. Add Item to User Doc
        //4. Decrement total for location
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        User.findById(req.body.user).then((u) => {
            if (u === null) { return res.status(400).send('Invalid User ID ') }

            StockItem.findById(req.params._id).then(s => {
                let isValidLocation = false;
                for (let i = 0; i < s.locationQuantity.length; i++) {

                    if (String(s.locationQuantity[i].location) === String(req.body.location)) {

                        isValidLocation = true

                        if (s.locationQuantity[i].quantity >= req.body.quantity) {

                            let userHasQuantity = false
                            for (let j = 0; j < s.userQuantity.length; j++) {

                                if (String(s.userQuantity[j].user) === String(u._id)) {

                                    userHasQuantity = true;
                                    s.userQuantity[j].quantity = Number(s.userQuantity[j].quantity) + Number(req.body.quantity)
                                }
                            }

                            if (!userHasQuantity) {
                                s.userQuantity.push({ user: req.body.user, quantity: req.body.quantity })
                            }
                            s.locationQuantity[i].quantity -= req.body.quantity
                            u.issueStockItem(req.params._id, req.body.quantity).then(() => {
                                s.save().then(result => {
                                    return res.send(result)
                                }).catch(err => { return res.send(err) })
                            })
                        } else {
                            return res.status(404).send('Not enough of this Stock Item at this location')
                        }
                    }
                }
                if (!isValidLocation) {
                    return res.status(404).send('This Stock item is not stored at this location')
                }
            })

        })
    })

    // Return Stock Item from User
    app.post(`${url}/:_id/return`, (req, res) => {

    })

    // Add New location and quantity
    // app.post(`${url}/:_id)`)

}