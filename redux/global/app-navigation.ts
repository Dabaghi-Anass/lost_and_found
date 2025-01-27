import { createSlice } from "@reduxjs/toolkit";
const appNavigationSlice = createSlice({
	name: "app-navigation",
	initialState: [] as Array<string>,
	reducers: {
		push: (state, action) => {
			state.push(action.payload);
			console.log(state);
		},
		pop: (state) => {
			state.pop();
			state.pop();
		},
		resetScreens: (state) => {
			return [];
		},
	},
});

export const { push, pop, resetScreens } = appNavigationSlice.actions;
export default appNavigationSlice.reducer;
