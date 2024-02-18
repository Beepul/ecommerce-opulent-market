import { baseApi } from "./baseApi";

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTotalSales: builder.query({
            query: () => '/admin/stats/total-sales',
            providesTags: [{type: 'Stats'}]
        }),
        getAllUser: builder.query({
            query: () => '/admin/stats/total-user',
            providesTags: [{type: 'Stats'}]
        }),
        totalProfileLoss: builder.query({
            query: () => '/admin/stats/total-profit-loss',
            providesTags: [{type: 'Stats'}]
        }),
        topCategories: builder.query({
            query: () => '/admin/stats/top-categories',
            providesTags: [{type: 'Stats'}]
        }),
        getBestSellingProduct: builder.query({
            query: () => '/admin/stats/best-selling-product',
            providesTags: [{type: 'Stats'}]
        }),
        getAllTransaction: builder.query({
            query: () => '/transaction',
            providesTags: [{type: 'Stats'}]
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