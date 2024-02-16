import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../type/user'

type AuthState = {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state,action) => {
      state.user = action.payload
    },
    logOutUser: (state) => {
      state.user = null
    }
  },
})


export const { setCredentials,logOutUser } = authSlice.actions

export default authSlice