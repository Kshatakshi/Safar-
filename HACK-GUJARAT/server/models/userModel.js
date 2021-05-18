const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'please provide your name!']
    },
    phone_no:{
        type:Number,
        required:[true,'please provide your phone number']
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validate.isEmail,'please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator:function(el){
                return el == this.password;
            },
            message:'password are not same'
        }
    },
    contact_info :[]
   
})

userSchema.pre('save', async function(next) {
    
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12); 
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
  

const User = mongoose.model('User',userSchema);
module.exports = User;