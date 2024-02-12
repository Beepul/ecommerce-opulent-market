import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../type/user'
import { useAutoLoginQuery } from '../services/authApi';

type AuthState = {
  user: User | null;
  // loading: 'idle' | 'pending' | 'succeeded' | 'failed';
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