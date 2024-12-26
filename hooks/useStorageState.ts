import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useStorageState<T>(key: string, defaultValue: T) {
	const [state, setState] = useState<T>(defaultValue);

	function init() {
		AsyncStorage.getItem(key).then((value) => {
			if (value) {
				setState(JSON.parse(value));
			}
		});
	}

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		AsyncStorage.setItem(key, JSON.stringify(state));
	}, [state]);

	return [state, setState] as const;
}
