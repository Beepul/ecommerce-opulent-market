import { User } from "./user";

export type Review = {
    content: string;
    product: string;
    rating: number;
    user: User;
    _id: string;
}