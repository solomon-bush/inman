const mongoose = require('mongoose');
let modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isTracked: {
        type: Boolean,
        required: true,
    },
    manufacturer: {
        type: mongoose.ObjectId,
        ref: 'Manufacturer',
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    description: String
}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('Model', modelSchema)
