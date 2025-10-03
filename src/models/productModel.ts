import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    stock: number;
    category: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
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

const Product = model<IProduct>("Product", productSchema);
export default Product;
