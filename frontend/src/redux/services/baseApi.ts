import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logOutUser, setCredentials } from "../features/authSlice";
import { User } from "../../type/user";

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}api/v1`,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.user?.accessToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

type ResponseUserData = {
    user: User
}


const baseQueryWithReauth = async (args:string | FetchArgs,api: BaseQueryApi,extraOptions: {})  => {

    // args -> /auth/autologin 
    // api -> extire authlogin endpoint
    // extraOptions -> undefined or query meta 

    let result = await baseQuery(args,api,extraOptions)

    if(result.error?.status === 401){
        const refreshResult = await baseQuery('/auth/refresh-token',api,extraOptions)
        console.log('RefreshResult::', refreshResult)
        if(refreshResult?.data){
            const userData = refreshResult.data as ResponseUserData
            api.dispatch(setCredentials(userData.user))
            result = await baseQuery(args,api,extraOptions)
        }else{
            if(refreshResult.error?.status === 403){
                // console.log('403, start')
                api.dispatch(logOutUser())
                // console.log('403, redux state cleared')
                await baseQuery({
                    url: '/auth/logout',
                    method: 'POST',
                    body: {}
                },api,extraOptions)
                // console.log('403,Cookie cleared')
            }
            return refreshResult
        }
    }
    return result
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    // keepUnusedDataFor: 5,
    tagTypes: ['AutoLogin','Product','SingleProduct','Category','Order','Stats'],
    endpoints: (_builder) => ({})
})  
