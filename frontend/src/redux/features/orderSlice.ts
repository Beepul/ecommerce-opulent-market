import { createSlice } from '@reduxjs/toolkit'

export type Address = {
  country: {
      code: string;
      name: string;
  };
  state: {
    code: string;
    name: string;
  };
  city: string;
  street: string;
  postalCode: number | null;
  phone: string;
  _id?: string;
}

type OrderState = {
    addressInfo: Address
}

let initialAddress = {
  country: {
    code: '',
      name: '',
    },
  state: {
    code: '',
    name: '',
  },
  city: '',
  street: '',
  postalCode: null,
  phone: ''
}

let initialState: OrderState = {
  addressInfo: initialAddress
}

const addressFromLocalStorage = localStorage.getItem('seven_add')

initialState.addressInfo = addressFromLocalStorage ? JSON.parse(addressFromLocalStorage) : initialAddress

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    addAddressInfo: (state,action) => {
        const {country,state: cstate,city,street,postalCode, phone} = action.payload
        state.addressInfo = {country, state: cstate,city,street,postalCode,phone}
        localStorage.setItem('seven_add', JSON.stringify(state.addressInfo))
    },
  },
})


export const { addAddressInfo } = orderSlice.actions

export default orderSlice