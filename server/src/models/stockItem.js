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
            quantity: Number,
            timestamp: { type: Number, default: () => { return Date.now() } },
            history: [mongoose.Schema.Types.Mixed]
        }
    ],

    userQuantity: [
        {
            _id: false,
            user: { type: mongoose.ObjectId, ref: 'User' },
            quantity: Number,
            timestamp: { type: Number, default: () => { return Date.now() } },
            history: [mongoose.Schema.Types.Mixed]
        }
    ]

}, { timestamps: true, versionKey: false })

//Validators
stockItemSchema.path('model').validate((value, respond) => {
    return utils.validateRef(value, respond, Model);
}, 'Invalid Model.');

//Methods

stockItemSchema.methods.locationQuantityExists = function (_id) {
    let result = false;
    this.locationQuantity.forEach(lq => {
        if (String(lq.location) === String(_id)) { result = true }
    });
    return result
}
stockItemSchema.methods.userQuantityExists = function (_id) {
    let result = false;
    this.userQuantity.forEach(uq => {
        if (String(uq.user) === String(_id)) { result = true }
    });
    return result
}
stockItemSchema.methods.addLocationQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (this.locationQuantityExists(_id)) { reject('Location Already Exists') }
        else {
            this.locationQuantity.push({ location: _id, quantity: quantity })
            resolve(this)
        }
    })
}
stockItemSchema.methods.removeLocationQuantity = function (_id) {
    return new Promise((resolve, reject) => {
        if (!this.locationQuantityExists(_id)) { reject('Invalid Location') }
        else {
            this.locationQuantity.map((v, i) => {
                if (String(v.location) === String(_id)) {
                    this.locationQuantity.splice(i, 1);
                    resolve(this);
                }
            })
        }
    })
}



stockItemSchema.methods.incrementLocationQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (!this.locationQuantityExists(_id)) { reject('Invalid Location') }
        else {
            this.locationQuantity.map((v, i) => {
                if (String(v.location) === String(_id)) {
                    this.locationQuantity[i].quantity = Number(v.quantity) + Number(quantity)
                    this.locationQuantity[i].history.push({ quantity: v.quantity, timestamp: v.timestamp })
                    this.locationQuantity[i].timestamp = Date.now()
                    resolve(this);
                }
            })
        }
    })

}

stockItemSchema.methods.decrementLocationQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (!this.locationQuantityExists(_id)) { reject('Invalid Location') }
        else {
            this.locationQuantity.map((v, i) => {
                if (String(v.location) === String(_id)) {
                    if (!(Number(v.quantity) >= Number(quantity))) { reject('Insufficient Quantity') }
                    else {
                        this.locationQuantity[i].quantity = Number(v.quantity) - Number(quantity)
                        this.locationQuantity[i].history.push({ quantity: v.quantity, timestamp: v.timestamp })
                        this.locationQuantity[i].timestamp = Date.now()
                        resolve(this);
                    }
                }
            })
        }
    })
}

stockItemSchema.methods.addUserQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (this.userQuantityExists(_id)) { reject('User Already Exists') }
        else {
            this.userQuantity.push({ user: _id, quantity: quantity })
            resolve(this)
        }
    })
}
stockItemSchema.methods.removeUserQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (!this.userQuantityExists(_id)) { reject('Invalid User') }
        else {
            this.userQuantity.map((v, i) => {
                if (String(v.user) === String(_id)) {
                    this.userQuantity.splice(i, 1);
                    resolve(this);
                }
            })
        }
    })
}
stockItemSchema.methods.incrementUserQuantity = function (_id, quantity) {
    return new Promise((resolve, reject) => {
        if (!this.userQuantityExists(_id)) { reject('Invalid User') }
        else {
            this.userQuantity.map((v, i) => {
                if (String(v.user) === String(_id)) {
                    this.userQuantity[i].quantity = Number(v.quantity) + Number(quantity)
                    this.userQuantity[i].history.push({ quantity: v.quantity, timestamp: v.timestamp })
                    this.userQuantity[i].timestamp = Date.now()
                    resolve(this);
                }
            })
        }
    })

}
stockItemSchema.methods.decrementUserQuantity = function (_id, quantity) {

    return new Promise((resolve, reject) => {
        if (!this.userQuantityExists(_id)) { reject('Invalid User') }
        else {
            this.userQuantity.map((v, i) => {
                if (String(v.user) === String(_id)) {
                    if (!(Number(v.quantity) >= Number(quantity))) { reject('Insufficient Quantity') }
                    else {
                        this.userQuantity[i].quantity = Number(v.quantity) - Number(quantity)
                        this.userQuantity[i].history.push({ quantity: v.quantity, timestamp: v.timestamp })
                        this.userQuantity[i].timestamp = Date.now()
                        resolve(this);
                    }

                }
            })
        }
    })
}



module.exports = mongoose.model('StockItem', stockItemSchema)
