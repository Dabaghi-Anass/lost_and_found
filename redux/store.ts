import { configureStore } from "@reduxjs/toolkit";
import appNavigationSlice from "./global/app-navigation";
import currentUser from "./global/current-user";
import currentScreenName from "./global/currentScreenName";
import itemsReducer from "./global/items";
import usersReducer from "./global/users";
export const store = configureStore({
	reducer: {
		user: currentUser,
		screenName: currentScreenName,
		items: itemsReducer,
		users: usersReducer,
		appNavigation: appNavigationSlice,
	},
});
