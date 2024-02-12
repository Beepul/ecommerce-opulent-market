export type Category = {
    name: string;
    _id: string;
    image?: {
      public_id: string;
      url: string;
    };
    count?: number; 
  }


export type TopCategory = {
  categoryName: string;
  totalSales: number;
  _id?: string;
}