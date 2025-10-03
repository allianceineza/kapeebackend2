import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface IUser extends Document {
    Name?: string;
    Email: string;
    Password: string;
    Role: "user" | "admin";
    tokens: {
        accessToken: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    Name: {
        type: String
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
        enum: ["user", "admin"]
    },
    tokens: {
        accessToken: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true
});

const User = model<IUser>("User", userSchema);
export default User;
