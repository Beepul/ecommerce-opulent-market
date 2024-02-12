import { createSlice } from '@reduxjs/toolkit'
import { CartProduct } from '../../type/product'
import { toast } from 'react-toastify'

type CartState = {
    cart: CartProduct[],
    totalPrice: number,
}

const cartDataFromLocalStorage = localStorage.getItem('seven_shop');
const parsedCartData = cartDataFromLocalStorage ? JSON.parse(cartDataFromLocalStorage) : {cart: [], totalPrice: 0};

const initialState: CartState = {
  cart: parsedCartData.cart,
  totalPrice: parsedCartData.totalPrice
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state,action) => {
      const exist = state.cart.find((c) => c._id === action.payload._id)
      if(exist){
        state.cart = state.cart.map((c) => {
          if(c._id === action.payload._id){
            toast.success(`Quantiy Increased for ${action.payload.name}`)
            return {...c,quantity: c.quantity + 1}
          }else{
            return c
          }
        })
      }else{
        toast.success(`${action.payload.name} is added to your cart`)
        state.cart = [...state.cart, {...action.payload, quantity: 1}]
      }
      state.totalPrice = state.cart.reduce((total,product) => total + (product.quantity * product.afterDiscountPrice),0)
      localStorage.setItem('seven_shop', JSON.stringify(state))
    },
    removeFromCart: (state,action) => {
      const exist = state.cart.find((c) => c._id === action.payload)
      if(exist){
        state.cart = state.cart.filter((c) => c._id !== action.payload)
        state.totalPrice = state.totalPrice - (exist.afterDiscountPrice * exist.quantity)
      }
      localStorage.setItem('seven_shop', JSON.stringify(state))

    },
    decreaseQnty: (state,action) => {
      const exist = state.cart.find((c) => c._id === action.payload)
      if(exist && exist.quantity <= 1){
        state.cart = state.cart.filter((c) => c._id !== action.payload)
        state.totalPrice -= exist.afterDiscountPrice
      }else{
        if(exist){
          state.cart = state.cart.map((c) => {
            if(c._id === action.payload){
              state.totalPrice -= c.afterDiscountPrice
              return {...c,quantity: c.quantity - 1}
            }else{
              return c
            }
          })
        }
      }
      localStorage.setItem('seven_shop', JSON.stringify(state))
    },
    clearCart: (state) => {
      state.cart = []
      state.totalPrice = 0
      localStorage.setItem('seven_shop', JSON.stringify(state))
    }
  },
})


export const { addToCart ,removeFromCart,decreaseQnty, clearCart} = cartSlice.actions

export default cartSlice