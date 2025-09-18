import mongoose from "mongoose";


const {model, Schema}=mongoose;
const signinSchema=Schema(
    {
    Email:{
        type: String,
        required:true   
    },
    Password:{
        type: String,
        required:true  
    },
    tokens: {
    accessToken: {
        type:String,
        default: ""
    }
    }
}

);

const User =model("user",signinSchema);
export default User