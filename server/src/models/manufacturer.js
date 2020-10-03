const mongoose = require('mongoose');
let manufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('Manufacturer', manufacturerSchema)
