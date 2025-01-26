import { refetchCurrentUserFromDb } from "@/api/database";
import { AppUser } from "@/types/entities.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
const currentUser = createSlice({
	name: "current-user",
	initialState: {} as AppUser,
	reducers: {
		refetchCurrentUser: (state) => {
			refetchCurrentUserFromDb();
		},
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
	},
});

export const { setCurrentUser, removeCurrentUser, refetchCurrentUser } =
	currentUser.actions;
export default currentUser.reducer;
