import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

const Order = model<IOrder>("Order", orderSchema);
export default Order;
