const mongoose = require('mongoose');
let locationSchema = new mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    bldg: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }, isStorage: {
        type: Boolean,
        required: true
    },
}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('Location', locationSchema)
