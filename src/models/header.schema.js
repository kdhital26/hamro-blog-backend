const mongoose = require('mongoose');


const headerSchema = mongoose.Schema({
    heading:{
        type: String,
        require: true,
        trim: true
    },
    body: [{type: mongoose.Schema.Types.ObjectId, ref: 'blog'}]
});

module.exports = mongoose.model('header', headerSchema)