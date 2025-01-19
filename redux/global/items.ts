import { Item } from "@/types/entities.types";
import { createSlice } from "@reduxjs/toolkit";
const itemsReducer = createSlice({
	name: "lost-items",
	initialState: [] as Item[],
	reducers: {
		setItems: (state, action) => {
			return action.payload;
		},
		addItem: (state, action) => {
			state.push(action.payload);
		},
		removeItem: (state, action) => {
			return state.filter((item) => item.id !== action.payload);
		},
		updateItem: (state, action) => {
			const index = state.findIndex(
				(item) => item.id === action.payload.id
			);
			state[index] = action.payload;
		},
		clearItems: (state) => {
			return [];
		},
	},
});

export const { setItems } = itemsReducer.actions;
export default itemsReducer.reducer;
