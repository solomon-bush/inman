const mongoose = require('mongoose');
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


module.exports = mongoose.model('Attachment', attachmentSchema)
