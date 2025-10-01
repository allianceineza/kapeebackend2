import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const cartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Cart = model<ICart>("Cart", cartSchema);
export default Cart;
