import { AppUser } from "@/types/entities.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
const currentUser = createSlice({
	name: "current-user",
	initialState: {} as AppUser,
	reducers: {
		setCurrentUser: (state, action) => {
			AsyncStorage.setItem("userID", action.payload?.id);
			return action.payload;
		},
		removeCurrentUser: (state, action) => {
			AsyncStorage.removeItem("userID");
			return {} as AppUser;
		},
	},
});

export const { setCurrentUser, removeCurrentUser } = currentUser.actions;
export default currentUser.reducer;
