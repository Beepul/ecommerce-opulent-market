import { Address } from "../redux/features/orderSlice";
import { CartProduct } from "./product";
import { User } from "./user";

export type Order = {
    paymentDetails: {
        paymentMethod: string;
        paymentStatus: string;
    };
    _id: string;
    user: User;
    items: CartProduct[];
    totalPrice: number;
    status: string;
    shippingAddress: Address;
    deliveredAt?: string;
}