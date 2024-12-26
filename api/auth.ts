import { auth } from "@/database/fire_base";
import {
	GoogleAuthProvider,
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

export async function loginUserWithGoogle() {
	try {
	} catch (e: any) {}
}
