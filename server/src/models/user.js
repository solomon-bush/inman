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
    phone: String,
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
        timestamp: {
            type: Date,
            default: () => {
                return Date.now()
            }
        },
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

    attachments: [{ type: mongoose.ObjectId, ref: 'Attachment' }]

}, { timestamps: true, versionKey: false })


userSchema.methods.assignAsset = function (_id) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < this.assignedAssets.length; i++) {
            if (String(this.assignedAssets[i].asset) === String(_id)) {
                this.assignedAssets.splice(i, 1)
            }
        }
        this.assignedAssets.push({ asset: _id })
        this.save()
        resolve()
    })
}

userSchema.methods.unassignAsset = function (_id) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < this.assignedAssets.length; i++) {
            if (String(this.assignedAssets[i].asset) === String(_id)) {
                this.assignedAssets.splice(i, 1)
            }
        }
        this.save()
        resolve();
    })
}

module.exports = mongoose.model('User', userSchema)
