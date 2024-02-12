import { baseApi } from "./baseApi";

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTotalSales: builder.query({
            query: () => '/admin/stats/total-sales'
        }),
        getAllUser: builder.query({
            query: () => '/admin/stats/total-user'
        }),
        totalProfileLoss: builder.query({
            query: () => '/admin/stats/total-profit-loss'
        }),
        topCategories: builder.query({
            query: () => '/admin/stats/top-categories'
        }),
        getBestSellingProduct: builder.query({
            query: () => '/admin/stats/best-selling-product'
        }),
        getAllTransaction: builder.query({
            query: () => '/transaction'
        })
    })
})


export const {
    useGetTotalSalesQuery,
    useGetAllUserQuery,
    useTotalProfileLossQuery,
    useTopCategoriesQuery,
    useGetBestSellingProductQuery,
    useGetAllTransactionQuery
} = statsApi