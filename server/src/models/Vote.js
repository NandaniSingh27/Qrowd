const mongoose = require('mongoose');
const Questions = require('./Question');

const voteSchema = new mongoose.Schema(
    {
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    voterId: {
        type: String,
        required: true,
    },
},
{ timestamps : true }
);
voteSchema.index({ question: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
