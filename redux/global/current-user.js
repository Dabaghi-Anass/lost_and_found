import { createSlice } from "@reduxjs/toolkit";

const currentUser = createSlice({
	name: "current-user",
	initialState: [],
	reducers: {},
});

export default currentUser.reducer;
