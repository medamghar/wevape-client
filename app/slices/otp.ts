import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const OtptpSlice = createSlice({
    name: 'otp',
    initialState: {
      phone: "",
      token:"" // Initial state for phone
    },
    reducers: {
      addPhone: (state, action :PayloadAction<string>) => {
        state.phone = action.payload; // Update the phone with data from action.payload
      },
     
    },
  });
  
  export const { addPhone } = OtptpSlice.actions; // Export the action for use in components
  export default OtptpSlice.reducer; // Export the reducer to add to your store
  