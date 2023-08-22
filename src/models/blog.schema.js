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
    // headerId: {type: mongoose.Schema.Types.ObjectId, ref: 'header'}
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('blog', blogSchema);


