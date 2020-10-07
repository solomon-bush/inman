const mongoose = require('mongoose');
const StockItem = require('./StockItem');
const Asset = require('./Asset')
const Location = require('./Location')
const utils = require('./_utils')

let userSchema = new mongoose.Schema({
    gtid: String,
    userName: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: String,
    department: String,
    title: String,
    phone: String,
    pin: String,

    pinFails: { type: String, default: 0 },

    location: { type: mongoose.ObjectId, ref: 'Location' },

    lastLogin: Date,
    loginHistory: [mongoose.Schema.Types.Mixed],

    assignedAssets: [{
        _id: false,
        asset: { type: mongoose.ObjectId, ref: 'Asset' },
        timestamp: { type: Number, default: () => { return Date.now() } },
    }],

    issuedStockItems: [{
        _id: false,
        stockItem: { type: mongoose.ObjectId, ref: 'StockItem' },
        quantity: Number,
        timestamp: { type: Number, default: () => { return Date.now() } },
    }],

    history: [mongoose.Schema.Types.Mixed],

    attachments: [{ type: mongoose.ObjectId, ref: 'Attachment' }]

}, { timestamps: true, versionKey: false })

//Validators

userSchema.path('location').validate((value, respond) => {
    return utils.validateRef(value, respond, Location);
}, 'Invalid Location ID.');






userSchema.methods.assignAsset = function (_id) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < this.assignedAssets.length; i++) {
            if (String(this.assignedAssets[i].asset) === String(_id)) {
                this.assignedAssets.splice(i, 1)
            }
        }
        this.history.push({
            timestamp: Date.now(), msg: 'Assigned Asset',
            refType: 'asset', ref: _id
        })

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
                this.history.push({
                    timestamp: Date.now(), msg: 'Unassigned Asset',
                    refType: 'asset', ref: _id
                })
            }
        }
        this.save()
        resolve();
    })
}



userSchema.methods.returnStockItem = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        let updated = false
        this.issuedStockItems.map((v, i) => {
            if (String(v.stockItem) === String(_id)) {
                if (Number(v.quantity) >= Number(quantity)) {
                    this.issuedStockItems[i].quantity = Number(v.quantity) - Number(quantity)
                    updated = true

                } else {
                    reject(`Insufficient Quantity - User only has ${v.quantity} items`)
                }
            }
        })
        if (!updated) { reject(`Invalid Stock Item - ${_id}`) }
        else {
            this.history.push({
                timestamp: Date.now(), msg: 'Returned StockItem',
                quantity: Number(quantity), refType: 'stockItem', ref: _id
            })
            this.save()
            resolve(this)
        }

    })
}

userSchema.methods.issueStockItem = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        let updated = false
        this.issuedStockItems.map((v, i) => {
            if (String(v.stockItem) === String(_id)) {
                this.issuedStockItems[i].quantity = Number(this.issuedStockItems[i].quantity) + Number(quantity)

                updated = true
            }
        })
        if (!updated) {
            this.issuedStockItems.push({ stockItem: _id, quantity: quantity })
        }
        this.history.push({
            timestamp: Date.now(), msg: 'Issued StockItem',
            quantity: Number(quantity), refType: 'stockItem', ref: _id
        })

        this.save()
        resolve(this)
    })
}


module.exports = mongoose.model('User', userSchema)
