const Category = require('../../../models/Category')

module.exports.set = (app) => {

    let url = '/api/category'
    // Get All
    app.get(`${url}`, (req, res) => {
        Category.find().then((results) => {
            res.send(results)
        })
    })


    // Get Details
    app.get(`${url}/:_id`, (req, res) => {
        Category.findById(req.params._id).then(results => { res.send(results) })
    })

    // TODO Get Stats
    app.get(`${url}/:_id/stats`, (req, res) => {
        res.send('In Progress')
    })

    // Create New 
    app.post(`${url}`, (req, res) => {
        let c = new Category({ ...req.body })
        c.save().then((result => { res.send(result) })).catch(err => { res.status(404).send(err) })
    })
    // Update Existing 
    app.put(`${url}/:_id`, (req, res) => {
        Category.findById(req.params._id).then(c => {
            if (c === null) {

            } else {
                Category.findByIdAndUpdate({ _id: req.params._id }, { ...req.body }, { new: true })
                    .then(result => {
                        res.send(result)
                    }).catch(err => {
                        res.status(404).send(err)
                    })
            }
        })
    })

}