import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface ICategory extends Document {
    name: string;
    description: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Category = model<ICategory>("Category", categorySchema);
export default Category;
