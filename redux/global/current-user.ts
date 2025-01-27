import { AppUser } from "@/types/entities.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";
const currentUser = createSlice({
	name: "current-user",
	initialState: {} as AppUser,
	reducers: {
		setCurrentUser: (state, action) => {
			const user = action.payload;
			if (!user?.id) return state;
			AsyncStorage.setItem("userID", user.id);
			for (const key in user) {
				state[key] = user[key];
			}
		},
		removeCurrentUser: (state, action) => {
			AsyncStorage.removeItem("userID");
			return {} as AppUser;
		},
		logout: (state) => {
			AsyncStorage.removeItem("userID");
			router.replace("/login");
			return {} as AppUser;
		},
	},
});

export const { setCurrentUser, removeCurrentUser, logout } =
	currentUser.actions;
export default currentUser.reducer;
