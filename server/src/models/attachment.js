const mongoose = require('mongoose');
const User = require('./User');
const utils = require('./_utils')

let attachmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    attachmentType: {
        type: String,
        default: 'none'
    },
    owner: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    notes: String,

}, { timestamps: true, versionKey: false })


attachmentSchema.path('owner').validate((value, respond) => {
    if (value !== null) {
        return utils.validateRef(value, respond, User);
    }
}, 'Invalid Owner (User).');


module.exports = mongoose.model('Attachment', attachmentSchema)
