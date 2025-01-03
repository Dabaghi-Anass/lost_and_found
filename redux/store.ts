import { configureStore } from "@reduxjs/toolkit";
import currentUser from "./global/current-user";

export const store = configureStore({
	reducer: {
		user: currentUser,
	},
});
