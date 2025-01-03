import { createSlice } from "@reduxjs/toolkit";

const currentUser = createSlice({
	name: "current-user",
	initialState: {},
	reducers: {
		setCurrentUser: (state, action) => {
			return action.payload;
		},
		removeCurrentUser: (state, action) => {
			return {};
		},
	},
});

export const { setCurrentUser, removeCurrentUser } = currentUser.actions;
export default currentUser.reducer;
