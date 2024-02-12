import { Category } from "./category";
import { Review } from "./review";


export type Image = {
    public_id: string;
    url: string;
    _id: string;
}

type Offer = {
    isOffered: boolean;
    offerEndDate: string | Date;
    offerStartDate: string | Date;
}


export type Product = {
    averageRating: number;
    category: Category[];
    description: string;
    images: Image[];
    isFeatured: boolean;
    name: string;
    offer: Offer;
    price: number;
    discountPercentage: number;
    reviews: Review[];
    stockQuantity: number;
    totalQuantitySold: number;
    _id: string;
}


export type CartProduct = Product & {
    quantity: number,
    afterDiscountPrice: number,
}

export type BestSellingProduct = {
    product: Product;
    totalQuantitySold: number;
}