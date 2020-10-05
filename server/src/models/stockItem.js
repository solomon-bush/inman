const mongoose = require('mongoose');
const Model = require('./Model')
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
    totalQuantity: {
        type: Number,
        default: function () {
            let total = 0
            this.locationQuantity.forEach(l => {
                total += l.quantity
            })
            return total
        }
    },

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


module.exports = mongoose.model('StockItem', stockItemSchema)
