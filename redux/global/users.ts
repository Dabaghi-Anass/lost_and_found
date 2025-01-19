import { AppUser } from "@/types/entities.types";
import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();
const usersReducer = createSlice({
	name: "users",
	initialState: {} as Record<string, AppUser>,
	reducers: {
		setUsers: (state, action) => {
			const usersMap = {} as Record<string, AppUser>;
			action.payload.forEach((user: AppUser) => {
				if (!user.id) return;
				usersMap[user.id] = user;
			});
			return usersMap;
		},
		saveUser: (state, action) => {
			const user = action.payload;
			if (!user.id) return;
			state[user.id] = user;
		},
		removeUser: (state, action) => {
			const id = action.payload;
			delete state[id];
			return state;
		},
		clearUsers: () => {
			return {};
		},
	},
});

export const { saveUser, setUsers, removeUser, clearUsers } =
	usersReducer.actions;
export default usersReducer.reducer;
