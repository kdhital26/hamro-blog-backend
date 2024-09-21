const mongoose = require('mongoose')

const bookmark = mongoose.Schema({
    bookmarked: {
        type: Boolean,
    },
    blogId: {type: mongoose.Schema.Types.ObjectId, ref: 'blog'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

}, { timestamps: true });

module.exports = mongoose.model('bookmark', bookmark);