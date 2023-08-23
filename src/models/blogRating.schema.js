const mongoose = require('mongoose')

const blogRating = mongoose.Schema({
    rating: {
        type: Number,
        trim: true
    },
    blogId: {type: mongoose.Schema.Types.ObjectId, ref: 'blog'}

}, { timestamps: true });

module.exports = mongoose.model('blograting', blogRating);