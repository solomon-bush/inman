const Asset = require('../../../models/Asset')
const User = require('../../../models/User')

module.exports.set = (app) => {
    let url = '/api/asset'

    app.get(`${url}`, (req, res) => {
        Asset.find().populate('identifiers.model')
            .then(assets => res.send(assets))
    })

    app.put(`${url}/:_id/assignee`, (req, res) => {
        //TODO
        Asset.findById(req.params._id).then(a => {
            console.log(a)
            a.assignee = req.body.user
            a.save().then(() => {
                User.findById(req.body.user).then(async u => {
                    u.assignedAssets.push({ asset: a._id, timestamp: Date.now() })
                    await u.save()
                    Asset.findById(req.params._id).populate('assignee').populate('assignee.assignedAssets').then(result => {
                        res.send(result)
                    })
                })
            })
        })
    })

}