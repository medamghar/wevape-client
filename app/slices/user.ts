
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  raisonSocial: string;
  address: string;
  latitude: string;
  longitude: string;
  type: string;
  phone: string;
}

const initialState: UserState = {
  name: "",
  raisonSocial: "",
  address: "",
  latitude: "",
  longitude: "",
  type: "",
  phone: "",
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      // Update all user information from the action payload
      const { name, raisonSocial, address, latitude, longitude, type, phone } = action.payload;
      state.name = name;
      state.raisonSocial = raisonSocial;
      state.address = address;
      state.latitude = latitude;
      state.longitude = longitude;
      state.type = type;
      state.phone = phone;
    },
  },
});

export const { addUser } = UserSlice.actions; // Export the action for use in components
export default UserSlice.reducer; // Export the reducer to add to your store
