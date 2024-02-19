import { Address } from "../redux/features/orderSlice";
import { CartProduct } from "./product";
import { User } from "./user";

type OrderItem = {
    product: CartProduct;
    quantity: number;
    _id: string;
}

export type Order = {
    createdAt: string,
    paymentDetails: {
        paymentMethod: string;
        paymentStatus: string;
    };
    _id: string;
    user: User;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    shippingAddress: Address;
    deliveredAt?: string;
}