const mongoose = require('mongoose');
let stockItemSchema = new mongoose.Schema({
    identifiers: {
        model: {
            type: mongoose.ObjectId,
            ref: 'model'
        },
        tags: [String]
    },
    locationQuantity: [{
        location: {
            type: mongoose.ObjectId,
            ref: 'Location'
        },
        quantity: Number,
    }],

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

    transactionHistory: [
        {
            user: {
                type: mongoose.ObjectId,
                ref: 'User'
            },
            transaction: {
                type: String,
                enum: ['Check-In', 'Check-Out']
            },
            location: {
                type: mongoose.ObjectId,
                ref: 'Location'
            },
            quantity: Number,
            timestamp: Date
        }
    ],
}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('StockItem', stockItemSchema)
