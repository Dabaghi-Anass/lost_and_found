import { auth } from "@/database/fire_base";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
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

export async function loginUserWithGoogle(): Promise<User | undefined> {
	try {
		const provider = new GoogleAuthProvider();
		const cred = await signInWithPopup(auth, provider);
		return cred.user;
	} catch (e: any) {
		return undefined;
	}
}

export async function logoutUser(): Promise<void> {
	await auth.signOut();
}

export async function registerUserWithEmailAndPassword(
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

export async function registerUserWithGoogle(): Promise<User | undefined> {
	try {
		const provider = new GoogleAuthProvider();
		const cred = await signInWithPopup(auth, provider);
		return cred.user;
	} catch (e: any) {
		return undefined;
	}
}
