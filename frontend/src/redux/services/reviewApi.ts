import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (data) => ({
                url: `/review/${data.productId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'SingleProduct'}]
        }) 
    })
})


export const {useCreateReviewMutation} = reviewApi