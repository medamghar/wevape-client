import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ModalState {
    open:boolean
    
  }
  
const ModalSlice = createSlice({
    name: 'modal',
    initialState: {
      open:false,
      city:"" // Initial state for phone
    },
    reducers: {
        setModalCity: (state, action: PayloadAction<string>) => {
            state.city = action.payload;
          },
      ModalStatus: (state, action :PayloadAction<ModalState>) => {

        const {open } =action.payload
        state.open =open;
      },
      
    },
  });
  
  export const { ModalStatus ,setModalCity} = ModalSlice.actions; // Export the action for use in components
  export default ModalSlice.reducer; // Export the reducer to add to your store
  