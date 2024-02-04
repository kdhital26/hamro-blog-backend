var mongoose = require('mongoose');

// creating schema
const userSchema = mongoose.Schema({
   firstName: {
      type: String,
      required: true,
      trim: true
   },
   middleName: String,
   lastName: {
      type: String,
      required: true,
      trim: true
   },
   email: {
      type: String,
      unique: [true, "email already exists!"],
      lowercase: true,
      trim: true,
   },
   password: {
      type: String,
   },
   createdAt: {
      type: Date,
      default: Date.now
    },
    active: {
       type: Boolean,
       default:  true
    },
    userName: {
        type: String,
        require: true,
        trim: true,
        unique: [true, "User Name already exists!"],
    },
    hPassword: {
      type: String,
      required: true,
      trim: true,

    },
    password: {
      
    }
}, { timestamps: true });

//added methods to schema
userSchema.methods.fullName = function () {
   return this.firstName + " " + this.lastName; 
}

// define our users model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', userSchema)


 