import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (data) => ({
                url: '/products/',
                method: 'POST',
                body: {...data}
            }),
            invalidatesTags: [{type: 'Product'},{type: 'Category'}]
        }),
        getProducts: builder.query({
            query: ({ category, rating, minPrice, maxPrice, sortBy, search, page, perPage, isOffered }) => {
                // console.log({page,perPage})
                const params = new URLSearchParams();
        
                if (category && category.length > 0) {
                    params.append('category', category.join());
                }
                if (rating) {
                    params.append('rating', rating.toString());
                }
                if (minPrice >= 0 && maxPrice) {
                    params.append('minPrice', minPrice.toString());
                    params.append('maxPrice', maxPrice.toString());
                }
                if (sortBy) {
                    params.append('sortBy', sortBy);
                }
                if (search) {
                    params.append('search', search);
                }

                if((page >= 0) && perPage){
                    params.append('page', page)
                    params.append('perPage', perPage)
                }

                if(isOffered) {
                    params.append('isOffered', isOffered)
                }
        
                const queryString = params.toString();
                const query = queryString ? `/products/?${queryString}` : '/products/';
                console.log(query)
                return query;
            },
            providesTags: ['Product']
        }),        
        updateProduct: builder.mutation({
            query: ({id,data}) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [{type: 'Product'}]
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Product'}]
        }),
        getSingleProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: ['SingleProduct']
        }),
    })
})


export const {
    useAddProductMutation,
    useGetProductsQuery, 
    useUpdateProductMutation, 
    useDeleteProductMutation,
    useGetSingleProductQuery
} = productApi