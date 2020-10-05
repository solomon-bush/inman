const mongoose = require('mongoose');
const Category = require('./Category')
const Manufacturer = require('./Manufacturer')
const utils = require('./_utils')


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


//Validators
modelSchema.path('manufacturer').validate((value, respond) => {
    return utils.validateRef(value, respond, Manufacturer);
}, 'Invalid Manufacturer.');

modelSchema.path('category').validate((value, respond) => {
    return utils.validateRef(value, respond, Category);
}, 'Invalid Category.');


module.exports = mongoose.model('Model', modelSchema)
