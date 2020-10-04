const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    gtid: String,
    userName: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: String,
    department: String,
    title: String,
    pin: String,

    pinFails: {
        type: String,
        default: 0
    },

    isRemote: {
        type: Boolean,
        default: false
    },

    location: {
        type: mongoose.ObjectId,
        ref: 'Location'
    },

    lastLogin: Date,

    assignedAssets: [{
        _id: false,
        asset: {
            type: mongoose.ObjectId,
            ref: 'Asset'
        },
        timestamp: Date
    }],

    issuedStockItems: [{
        _id: false,
        stockItem: {
            type: mongoose.ObjectId,
            ref: 'StockItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        timestamp: Date
    }],

    transactionHistory: [
        {
            _id: false,
            targetID: {
                type: mongoose.ObjectId,
                required: true
            },
            targetType: {
                type: String,
                enum: ['Asset', 'StockItem'],
                required: true,
            },
            transaction: {
                type: String,
                enum: ['Check-In', 'Check-Out']
            },
            timestamp: Date
        }
    ],
    attachments: [{ type: mongoose.ObjectId, ref: 'Attachment' }]

}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('User', userSchema)
