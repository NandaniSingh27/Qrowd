const mongoose = require('mongoose');
const { maxLength } = require('zod');

const roomSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
},

{ timestamps: true }

);

module.exports = mongoose.model('Room', roomSchema);