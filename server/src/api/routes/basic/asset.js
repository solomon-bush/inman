const Asset = require('../../../models/Asset')
const User = require('../../../models/User')

module.exports.set = (app) => {
    let url = '/api/asset'
    // Get all assets
    app.get(`${url}`, (req, res) => {
        Asset.find().populate('identifiers.model')
            .then(assets => res.send(assets))
    })
    // Assign Asset to User
    app.put(`${url}/:_id/assignee`, (req, res) => {
        Asset.findById(req.params._id)
            .then(a => {
                if (a === null) {
                    res.status(404).send('No Asset found')
                } else {
                    a.updateAssignee(req.body.user)
                        .then(asset => {
                            res.send(asset)
                        }).catch(err => {
                            res.status(404).send(err)
                        })
                }
            })
            .catch((err) => { res.status(404).send(err) })
    })
    // Unassign Asset from User
    app.delete(`${url}/:_id/assignee`, (req, res) => {
        Asset.findById(req.params._id).then(a => {
            if (a === null) {
                res.status(404).send('No Asset found')
            } else {
                a.removeAssignee().then(asset => {
                    res.send(asset)
                }).catch(err => { res.status(404).send(err) })
            }
        }).catch(err => { res.status(404).send(err) })
    })

    // Create new Asset
    app.post(`${url}`, (req, res) => {
        let a = new Asset({ ...req.body })
        a.save().then((result => { res.send(result) })).catch(err => { res.status(404).send(err) })
    })

    // Update an Existing Asset
    app.put(`${url}/:_id`, (req, res) => {
        Asset.findById(req.params._id).then(a => {
            if (a === null) {
                res.status(404).send('No Asset found')
            } else {
                Asset.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                    .then(result => {
                        res.send(result)
                    }).catch(err => {
                        res.status(404).send(err)
                    })
            }

        })
    })

    // Add an attachment to an Asset
    app.post(`${url}/:_id/attachment`, (req, res) => {
        //TODO
        res.send('TODO')
    })

}