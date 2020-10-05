const Manufacturer = require('../../../models/Manufacturer')

module.exports.set = (app) => {

    let url = '/api/manufacturer'
    // Get All
    app.get(`${url}`, (req, res) => {
        Manufacturer.find().then((results) => {
            res.send(results)
        })
    })


    // Get Details
    app.get(`${url}/:_id`, (req, res) => {
        Manufacturer.findById(req.params._id).then(results => { res.send(results) })
    })

    // TODO Get Stats
    app.get(`${url}/:_id/stats`, (req, res) => {
        res.send('In Progress')
    })

    // Create New 
    app.post(`${url}`, (req, res) => {
        let m = new Manufacturer({ ...req.body })
        m.save().then((result => { res.send(result) })).catch(err => { res.status(404).send(err) })
    })
    // Update Existing 
    app.put(`${url}/:_id`, (req, res) => {
        Manufacturer.findById(req.params._id).then(m => {
            if (m === null) {
                res.send('Invalid ID')
            } else {
                Manufacturer.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                    .then(result => {
                        res.send(result)
                    }).catch(err => {
                        res.status(404).send(err)
                    })
            }
        })
    })
}