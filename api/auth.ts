import { auth, firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser } from "@/types/entities.types";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	User,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fetchProfileById } from "./database";

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
	await auth.signOut();
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
