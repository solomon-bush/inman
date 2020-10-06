const mongoose = require('mongoose');
const Model = require('./Model')
const Location = require('./Location')
const User = require('./User')
const utils = require('./_utils')


let stockItemSchema = new mongoose.Schema({
    model: {
        type: mongoose.ObjectId,
        ref: 'Model'
    },
    tags: [String],
    locationQuantity: [
        {
            _id: false,
            location: { type: mongoose.ObjectId, ref: 'Location' },
            quantity: Number
        }
    ],
    userQuantity: [
        {
            _id: false,
            user: { type: mongoose.ObjectId, ref: 'User' },
            quantity: Number
        }
    ]

    // transactionHistory: [
    //     {
    //         user: {
    //             type: mongoose.ObjectId,
    //             ref: 'User'
    //         },
    //         transaction: {
    //             type: String,
    //             enum: ['Check-In', 'Check-Out']
    //         },
    //         location: {
    //             type: mongoose.ObjectId,
    //             ref: 'Location'
    //         },
    //         quantity: Number,
    //         timestamp: Date,
    //         _id: false
    //     }
    // ],
}, { timestamps: true, versionKey: false })

//Validators
stockItemSchema.path('model').validate((value, respond) => {
    return utils.validateRef(value, respond, Model);
}, 'Invalid Model.');


stockItemSchema.path('locationQuantity.location').validate((value, respond) => {
    return utils.validateRef(value, respond, Location);
}, 'Invalid Location ID.');

stockItemSchema.path('userQuantity.user').validate((value, respond) => {
    return utils.validateRef(value, respond, User);
}, 'Invalid User ID.');



module.exports = mongoose.model('StockItem', stockItemSchema)
