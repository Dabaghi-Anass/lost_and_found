import { AppUser } from "@/types/entities.types";
import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();
const usersReducer = createSlice({
	name: "users",
	initialState: new Map() as Map<string, AppUser>,
	reducers: {
		setUsers: (state, action) => {
			const usersMap = new Map<string, AppUser>();
			action.payload.forEach((user: AppUser) => {
				if (!user.id) return;
				usersMap.set(user.id, user);
			});
			return usersMap;
		},
		saveUser: (state, action) => {
			const user = action.payload;
			if (!user.id) return;
			state.set(user.id, user);
		},
		removeUser: (state, action) => {
			const id = action.payload;
			state.delete(id);
		},
		clearUsers: () => {
			return new Map();
		},
	},
});

export const { saveUser, setUsers, removeUser, clearUsers } =
	usersReducer.actions;
export default usersReducer.reducer;
