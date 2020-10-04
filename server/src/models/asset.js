const mongoose = require('mongoose');
const User = require('./User');
let assetSchema = new mongoose.Schema({

    identifiers: {
        model: {
            type: mongoose.ObjectId,
            ref: 'Model',
            required: true
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
        default: null
    },
    previousAssignees: [{
        _id: false,
        user: {
            type: mongoose.ObjectId,
            ref: 'User',
        },
        timestamp: {
            type: Date,
            default: () => {
                return Date.now()
            }
        },
    }
    ],

    status: {
        type: String,
        enum: ['In-Stock', 'In-Transit', 'Assigned'],
        default: 'In-Stock'
    },

    attachments: [{ type: mongoose.ObjectId, ref: 'Attachment' }]

}, { timestamps: true, versionKey: false })

assetSchema.methods.updateAssignee = function (_id) {
    return new Promise((resolve, reject) => {
        if (!_id) {
            reject('No User _id defined')
        }
        User.findById(_id)
            .then((user) => {
                if (!user) { reject('User not found') }
                else {
                    if (this.assignee === null) {
                        this.assignee = user._id
                        this.status = 'Assigned'
                        this.save().then(result => {
                            user.assignAsset(this._id).then(() => {
                                resolve(result)
                            })
                        })
                    } else {
                        if (String(this.assignee) === String(user._id)) {
                            reject('User already assigned')
                        } else {
                            this.previousAssignees.push({ user: this.assignee })
                            User.findById(this.assignee).then(u => {
                                u.unassignAsset(this._id).then(() => {
                                    this.assignee = user._id
                                    this.status = 'Assigned'
                                    this.save().then(result => {
                                        user.assignAsset(this._id).then(() => {
                                            resolve(result)
                                        })
                                    })
                                })
                            })
                        }
                    }
                }

            })
            .catch((err) => { console.log(err); reject(err) })
    })
}
assetSchema.methods.removeAssignee = function () {
    return new Promise((resolve, reject) => {
        if (this.assignee !== null) {
            User.findById(this.assignee).then(user => {
                user.unassignAsset(this._id).then(() => {
                    this.previousAssignees.push({ user: this.assignee })
                    this.status = 'In-Stock'
                    this.assignee = null;
                    this.save().then(result => { resolve(result) });
                })
            })
        } else {
            this.status = 'In-Stock'
            resolve(this)
        }
    })
}





module.exports = mongoose.model('Asset', assetSchema)
