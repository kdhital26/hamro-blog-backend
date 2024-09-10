const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    
    title:{
        type: String,
        required: true,
        trim: true
    },
    file: {
        type: String,
        // required: true
      },
    active: {
        type: Boolean,
        trim: true,
    },
    ratingId: {type: mongoose.Schema.Types.ObjectId, ref: 'blograting'},
    commentId: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'comment'
        }
    ],
    count: {
        type: Number,
        trim: true,
        default: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    cloudinaryPath:{
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    }, 
    loggedInUser: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('blog', blogSchema);


