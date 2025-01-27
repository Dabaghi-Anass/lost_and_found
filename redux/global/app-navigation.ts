import { createSlice } from "@reduxjs/toolkit";
const appNavigationSlice = createSlice({
	name: "app-navigation",
	initialState: [] as Array<string>,
	reducers: {
		push: (state, action) => {
			if (state.at(-1) !== action.payload) {
				state.push(action.payload);
				state = [...new Set(state)];
			}
		},
		pop: (state) => {
			state.pop();
		},
		resetScreens: (state) => {
			return [];
		},
	},
});

export const { push, pop, resetScreens } = appNavigationSlice.actions;
export default appNavigationSlice.reducer;
