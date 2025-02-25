import { configureStore } from '@reduxjs/toolkit';
import OtpSlice from '@/app/slices/otp'
import ModalSlice from '@/app/slices/modal'
import ProductsSlice from '@/app/slices/products'
import LikedProduct from '@/app/slices/likedProducts'

const store = configureStore({
  reducer: {
    otp:OtpSlice ,
    modal:ModalSlice,
    products:ProductsSlice,
    prodctFavCounter:LikedProduct
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store