import { Item } from "@/types/entities.types";
import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();
const itemsReducer = createSlice({
	name: "lost-items",
	initialState: {} as Record<string, Item>,
	reducers: {
		setItems: (state, action) => {
			const itemsMap = {} as Record<string, Item>;
			action.payload.forEach((item: Item) => {
				if (!item.id) return;
				itemsMap[item.id] = item;
			});
			return itemsMap;
		},
		saveItem: (state, action) => {
			const item = action.payload;
			if (!item.id) return;
			state[item.id] = item;
			return state;
		},
		removeItem: (state, action) => {
			const id = action.payload;
			delete state[id];
			return state;
		},
		clearItems: () => {
			return {} as Record<string, Item>;
		},
	},
});

export const { saveItem, setItems, removeItem, clearItems } =
	itemsReducer.actions;
export default itemsReducer.reducer;
