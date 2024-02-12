import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/cartSlice'
import authSlice from './features/authSlice'
import { baseApi } from './services/baseApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import orderSlice from './features/orderSlice'



export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
    order: orderSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: true
})


setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch