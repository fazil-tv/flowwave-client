import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AdminState = {
  Admin_Token: string | null;
  Admin_refreshToken: string | null;
};

const initialState: AdminState = {
  Admin_Token: typeof window !== "undefined" && localStorage.getItem('Admin_Token')
    ? localStorage.getItem('Admin_Token')
    : null,
  Admin_refreshToken: typeof window !== "undefined" && localStorage.getItem('Admin_refreshToken')
    ? localStorage.getItem('Admin_refreshToken')
    : null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.Admin_Token = action.payload.accessToken;
      state.Admin_refreshToken = action.payload.refreshToken;
      localStorage.setItem('Admin_Token', action.payload.accessToken);
      localStorage.setItem('Admin_refreshToken', action.payload.refreshToken);
    },

    logoutSuccess: (state) => {
      state.Admin_Token = null;
      state.Admin_refreshToken = null;
      localStorage.removeItem('Admin_Token');
      localStorage.removeItem('Admin_refreshToken');
    },
  },
});

export const { signInSuccess, logoutSuccess } = adminSlice.actions;

export default adminSlice.reducer;
