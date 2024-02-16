import { ResponseError } from "../../type/error";
import { LoginRegisterData } from "../../type/user";
import { logOutUser, setCredentials } from "../features/authSlice";
import { baseApi } from "./baseApi";



export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data: LoginRegisterData) => ({
                url: '/auth/login',
                method: 'POST',
                body: {...data}
            }),
        }),
        register: builder.mutation({
            query: (data: LoginRegisterData) => ({
                url: '/auth/',
                method: 'POST',
                body: {...data},
            }),
        }),
        activateUser: builder.query({
            query: (token: string) => `/auth/activation/${token}`
        }),
        autoLogin: builder.query({
            query: () => '/auth/auto-login',
            forceRefetch({currentArg,previousArg: _}){
                return currentArg
            },
            providesTags: ['AutoLogin'],
            async onQueryStarted(_arg,{dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    dispatch(setCredentials(data.user))
                } catch (error) {
                    console.log("Auto Login Error::", error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags :[{type: 'AutoLogin'}],
            async onQueryStarted(_arg,{dispatch, queryFulfilled}){
                try {
                    await queryFulfilled
                    dispatch(logOutUser())
                } catch (error) {
                    const resError = error as ResponseError
                    throw new Error(resError?.data?.message)
                }
            }
        }),
        updateCredentials: builder.mutation({
            query: (data) => ({
                url: '/auth/update/user',
                method: 'PUT',
                body: data
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    console.log('From API', data)
                    dispatch(setCredentials(data.user))
                } catch (error) {
                    const resError = error as ResponseError
                    throw new Error(resError?.data?.message)
                }
            }
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/update/password',
                method: 'PUT',
                body: data
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    dispatch(setCredentials(data.user))
                } catch (error) {
                    const resError = error as ResponseError
                    throw new Error(resError?.data?.message)
                }
            }
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/password-rest-link',
                method: 'POST',
                body: data
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ( {
                url: '/auth/reset-password',
                method: 'PUT',
                body: data
            })
        }),
        googleLogin: builder.mutation({
            query: (data) => {
                return ({
                    url: '/auth/google-login',
                    method: 'POST',
                    body: data
                })
            }
        })
    })
})


export const { 
    useLoginMutation,
    useRegisterMutation, 
    useActivateUserQuery, 
    useAutoLoginQuery, 
    useLogoutUserMutation, 
    useUpdateCredentialsMutation, 
    useUpdatePasswordMutation ,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGoogleLoginMutation
} = authApi