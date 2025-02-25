import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ModalState {
    total:Number
    
  }
  
const LikedProduct = createSlice({
    name: 'likedProduct',
    initialState: {
     total:0
    },
    reducers: {
        setFavProductsCount: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
          },
      
      
    },
  });
  
  export const { setFavProductsCount} = LikedProduct.actions; // Export the action for use in components
  export default LikedProduct.reducer; // Export the reducer to add to your store
  