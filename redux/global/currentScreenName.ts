import { createSlice } from "@reduxjs/toolkit";
const currentScreenName = createSlice({
	name: "current-user",
	initialState: "home",
	reducers: {
		setCurrentScreenName: (state, action) => {
			return action.payload;
		},
	},
});

export const { setCurrentScreenName } = currentScreenName.actions;
export default currentScreenName.reducer;
