import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
    name: 'products',
    initialState: {
        collection_id: "",
        mark_id: "",
        product_id:0 ,
        cartLength:0,
         orderId:""// Initial state for collection_id
    },
    reducers: {
        addCollectionId: (state, action: PayloadAction<string>) => {
            state.collection_id = action.payload; // Update the collection_id with data from action.payload
        },
        addMarkId: (state, action: PayloadAction<string>) => {
            state.mark_id = action.payload; // Update the collection_id with data from action.payload
        },
        addProductId: (state, action: PayloadAction<number>) => {
            state.product_id = action.payload; // Update the collection_id with data from action.payload
        },
        updateCart: (state, action: PayloadAction<number>) => {
            state.cartLength = action.payload; // Update the collection_id with data from action.payload
        },
        addOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload; // Update the collection_id with data from action.payload
        },
    },
});

export const { addCollectionId,addProductId,updateCart,addMarkId ,addOrderId } = ProductsSlice.actions; // Export the action for use in components
export default ProductsSlice.reducer; // Export the reducer to add to your store