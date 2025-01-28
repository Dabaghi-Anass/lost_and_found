import { createSlice } from "@reduxjs/toolkit";
const appInitialUrl = createSlice({
	name: "initial-url",
	initialState: {
		url: null as string | null,
		updated: false,
	},
	reducers: {
		setInitialUrl: (state, action) => {
			if (state.updated) return;
			state.url = action.payload;
			state.updated = true;
		},
	},
});

export const { setInitialUrl } = appInitialUrl.actions;
export default appInitialUrl.reducer;
