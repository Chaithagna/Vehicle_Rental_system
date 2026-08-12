import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    roles:{
        type:[String],
        enum:["user","admin","customer"],
        default:["user"]
    },
    
    isSuspended: {
    type: Boolean,
    default: false
}
});
export default mongoose.model("User", userSchema);