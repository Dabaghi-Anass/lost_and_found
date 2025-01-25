import { getUserById } from "@/api/database";
import { AppUser } from "@/types/entities.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";
const currentUser = createSlice({
	name: "current-user",
	initialState: {} as AppUser,
	reducers: {
		refetchCurrentUser: (state) => {
			AsyncStorage.getItem("userID").then((id) => {
				if (id) {
					getUserById(id).then((user) => {
						state = user as AppUser;
					});
				} else {
					router.replace("/login");
				}
			});
			return state;
		},
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

export const { setCurrentUser, removeCurrentUser, refetchCurrentUser } =
	currentUser.actions;
export default currentUser.reducer;
