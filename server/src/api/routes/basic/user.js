const User = require('../../../models/User')
const Location = require('../../../models/Location')
const { body, validationResult, param } = require('express-validator')

module.exports.set = (app) => {

    let url = '/api/user'
    // Get All
    app.get(`${url}`, (req, res) => {
        User.find()
            .select(['-history', '-attachments']).then(results => { res.send(results) })
    })
    // Get Details
    app.get(`${url}/:_id`,
        [param('_id').isMongoId()],
        (req, res) => {
            User.findById(req.params._id)
                .select(['-history', '-attachments'])
                // .populate(['location', 'assignedAssets.asset', 'issuedStockItems.stockItem'])
                .then(results => { res.send(results) })
        })
    // Get History
    app.get(`${url}/:_id/history`,
        [param('_id').isMongoId()],
        (req, res) => {
            User.findById(req.params._id)
                .then(results => { res.send(results.history) })
        })
    // Get Attachments
    app.get(`${url}/:_id/attachments`,
        [param('_id').isMongoId()],
        (req, res) => {
            User.findById(req.params._id)
                .then(results => { res.send(results.attachments) })
        })
    // Update Location 
    app.put(`${url}/:_id/location`,
        [
            param('_id').isMongoId(),
            body('location').isMongoId()
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            Location.findById(req.body.location).then(l => {
                if (l.isStorage !== false) {
                    return res.status(400).send('A user location must not be a storage location ')
                } else {
                    User.findByIdAndUpdate({ _id: req.params._id }, { location: req.body.location }, { new: true, runValidators: true }).then(u => {
                        res.send(u)
                    }).catch(err => { res.status(404).send(err) })
                }
            })
        })
}