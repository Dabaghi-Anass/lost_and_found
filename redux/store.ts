import { configureStore } from "@reduxjs/toolkit";
import currentUser from "./global/current-user";
import currentScreenName from "./global/currentScreenName";

export const store = configureStore({
	reducer: {
		user: currentUser,
		screenName: currentScreenName,
	},
});
