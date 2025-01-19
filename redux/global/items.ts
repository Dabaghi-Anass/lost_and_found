import { Item } from "@/types/entities.types";
import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();
const itemsReducer = createSlice({
	name: "lost-items",
	initialState: new Map() as Map<string, Item>,
	reducers: {
		setItems: (state, action) => {
			const itemsMap = new Map<string, Item>();
			action.payload.forEach((item: Item) => {
				if (!item.id) return;
				itemsMap.set(item.id, item);
			});
			return itemsMap;
		},
		saveItem: (state, action) => {
			const item = action.payload;
			if (!item.id) return;
			state.set(item.id, item);
		},
		removeItem: (state, action) => {
			const id = action.payload;
			state.delete(id);
		},
		clearItems: () => {
			return new Map();
		},
	},
});

export const { saveItem, setItems, removeItem, clearItems } =
	itemsReducer.actions;
export default itemsReducer.reducer;
