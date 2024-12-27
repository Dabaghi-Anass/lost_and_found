import { useColorScheme as useRNColorScheme } from "react-native";
import { useStorageState } from "./useStorageState";

enum ColorScheme {
	light = "light",
	dark = "dark",
}
export function useColorScheme() {
	const defaultScheme = useRNColorScheme();
	const [userPreferedScheme, setUserPreferedScheme] =
		useStorageState<ColorScheme | null>("color-scheme", null);
	if (userPreferedScheme) return userPreferedScheme;
	return defaultScheme || "light";
}
