const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comments: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('comment', commentSchema);