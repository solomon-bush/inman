const mongoose = require('mongoose');
let assetSchema = new mongoose.Schema({

    identifiers: {
        model: {
            type: mongoose.ObjectId,
            ref: 'Model'
        },
        sn: String,
        po: String,
        ticket: String,
        assetTag: String,
        tags: [String]
    },
    origin: {
        type: mongoose.ObjectId,
        ref: 'Location',
    },
    assignee: {
        type: mongoose.ObjectId,
        ref: 'User',
    },
    previousAssignees: [{
        user: {
            type: mongoose.ObjectId,
            ref: 'User',
        },
        whenCheckOut: Date,
        whenCheckIn: Date
    }],

    status: {
        type: String,
        enum: ['In-Stock', 'In-Transit', 'Assigned']
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
            timestamp: Date
        }
    ],
    attachments: [{ type: mongoose.ObjectId, ref: 'Attachment' }]

}, { timestamps: true, versionKey: false })


module.exports = mongoose.model('Asset', assetSchema)
