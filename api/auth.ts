import { auth } from "@/database/fire_base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	User,
} from "firebase/auth";

export async function loginUser(
	email: string,
	password: string
): Promise<User | undefined> {
	try {
		const cred = await signInWithEmailAndPassword(auth, email, password);
		return cred.user;
	} catch (error: any) {
		return undefined;
	}
}

export async function logoutUser(): Promise<void> {
	Promise.all([AsyncStorage.removeItem("userID"), auth.signOut()]);
}

export async function registerUser(
	email: string,
	password: string
): Promise<User | undefined> {
	try {
		const cred = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return cred.user;
	} catch (error: any) {
		return undefined;
	}
}
