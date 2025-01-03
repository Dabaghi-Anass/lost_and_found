import { auth, firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser } from "@/types/entities.types";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	User,
} from "firebase/auth";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";

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

export async function getUserById(
	userId: string
): Promise<AppUser | undefined> {
	const user = await getDoc(
		doc(firestore, FirebaseCollections.USERS, userId)
	);
	return user.data() as AppUser;
}
export async function getUserByAuthUserId(
	userId: string
): Promise<AppUser | undefined> {
	const usersCollection = collection(firestore, FirebaseCollections.USERS);
	const q = query(usersCollection, where("authUserId", "==", userId));

	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	return docs[0].data() as AppUser;
}
