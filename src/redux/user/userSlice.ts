import { IUser } from "@/types/database";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {

    currentUser: IUser | null;
    Token: string | null;
    refreshToken: string | null;

};

const initialState: UserState = {

    currentUser: typeof window !== "undefined" && localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null,
        Token: typeof window !== "undefined" && localStorage.getItem('Token')
        ? localStorage.getItem('Token')
        : null,
    refreshToken: typeof window !== "undefined" && localStorage.getItem('refreshToken')
        ? localStorage.getItem('refreshToken')
        : null,

};


const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signInSuccess: (state, action: PayloadAction<IUser & { accessToken: string; refreshToken: string }>) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('Token', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.Token = null;
            state.refreshToken = null;
            localStorage.removeItem('user');
            localStorage.removeItem('Token');
            localStorage.removeItem('refreshToken');
        },
    }
});

export const { signInSuccess, logoutSuccess } = userSlice.actions;

export default userSlice.reducer; 