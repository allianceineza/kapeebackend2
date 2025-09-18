import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true 
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        default: "user",
        enum: ["user", "admin"], // Changed "Admin" to "admin"
        required: true
    },
    tokens: {
        accessToken: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

const User = model("user", userSchema);
export default User;