import { auth, firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser, Item, ItemDetails, Profile } from "@/types/entities.types";
import { ImagePickerAsset } from "expo-image-picker";
import { User } from "firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	runTransaction,
	Transaction,
	where,
} from "firebase/firestore";
import { uploadAsset } from "./cloudinary";

export async function uploadImagesToServer(
	assets: ImagePickerAsset[]
): Promise<string[]> {
	return await Promise.all(
		assets.map((asset: ImagePickerAsset) => {
			return uploadAsset(asset);
		})
	);
}
export async function saveItemDetails(item: ItemDetails): Promise<ItemDetails> {
	try {
		const itemsCollection = collection(
			firestore,
			FirebaseCollections.ITEMS
		);
		const itemRef = await addDoc(itemsCollection, { ...item });
		item.id = itemRef.id;
		return await Promise.resolve(item);
	} catch (e: any) {
		console.error(e);
		return await Promise.reject(e);
	}
}

export async function saveItem(item: Item): Promise<Item> {
	try {
		let itemToSaveClone: Item = {} as Item;
		await runTransaction(firestore, async (transaction: Transaction) => {
			const itemsDetailsCollection = collection(
				firestore,
				FirebaseCollections.ITEMS
			);
			const itemsCollection = collection(
				firestore,
				FirebaseCollections.LOST_ITEMS
			);
			const itemDetailsRef = await addDoc(itemsDetailsCollection, {
				...item.item,
			});
			item.id = itemDetailsRef.id;

			const itemToSave = {
				...item,
				item: itemDetailsRef.id,
			};

			await addDoc(itemsCollection, itemToSave);

			itemToSaveClone = { ...itemToSave, item: item.item };
		});
		return Promise.resolve(itemToSaveClone);
	} catch (e: any) {
		console.error(e);
		return await Promise.reject(e);
	}
}

export async function saveUser(user: AppUser): Promise<AppUser> {
	try {
		let userToSaveClone: AppUser = {} as AppUser;
		await runTransaction(firestore, async (transaction: Transaction) => {
			const profilesCollection = collection(
				firestore,
				FirebaseCollections.PROFILES
			);
			const usersCollection = collection(
				firestore,
				FirebaseCollections.USERS
			);
			const profileRef = await addDoc(profilesCollection, {
				...(user.profile as Profile),
				id: doc(profilesCollection).id,
			});
			user.id = profileRef.id;
			user.profile.id = profileRef.id;
			const userToSave = {
				...user,
				profileId: profileRef.id,
			} as any;
			delete userToSave.profile;
			await addDoc(usersCollection, userToSave);

			userToSaveClone = { ...userToSave, profile: user.profile };
		});
		return Promise.resolve(userToSaveClone);
	} catch (e: any) {
		console.error(e);
		return await Promise.reject(e);
	}
}

export async function fetchItemsById(
	items: string[]
): Promise<Item[] | undefined> {
	if (items.length === 0) return Promise.resolve([]);
	const itemsCollection = collection(
		firestore,
		FirebaseCollections.LOST_ITEMS
	);
	const q = query(itemsCollection, where("id", "in", items));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("[items] No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	const itemsData = await Promise.all(
		docs.map(async (doc: any) => {
			const data = doc.data();
			data.item = await fetchItemDetailsById(data.item as string);
			data.found_lost_at = data.found_lost_at.seconds * 1000;
			return data as Item;
		})
	);

	return itemsData;
}

export async function fetchItemById(itemId: string): Promise<Item | undefined> {
	const itemsCollection = collection(
		firestore,
		FirebaseCollections.LOST_ITEMS
	);
	const q = query(itemsCollection, where("id", "==", itemId));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("[item] No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	const item = docs[0].data();
	item.item = await fetchItemDetailsById(item.item);
	if (item.ownerId) {
		item.owner = await fetchProfileById(item.ownerId);
	}
	item.found_lost_at = item.found_lost_at.seconds * 1000;
	return item as Item;
}

export async function getUserByAuthUserId(
	userId: string
): Promise<AppUser | undefined> {
	const usersCollection = collection(firestore, FirebaseCollections.USERS);
	const q = query(usersCollection, where("authUserId", "==", userId));

	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("[userByAuth] No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	const user = docs[0].data();
	user.profile = await fetchProfileById(user.profileId);
	try {
		user.items = await fetchItemsById(user.items);
	} catch (e: any) {
		console.error(e);
	}
	return user as AppUser;
}

export async function fetchAuthUserById(
	itemId: string
): Promise<User | undefined> {
	try {
		return Promise.resolve(auth.currentUser || undefined);
	} catch (e: any) {
		console.error(e);
		return Promise.reject(e);
	}
}
export async function fetchUserById(
	userId: string
): Promise<AppUser | undefined> {
	console.log(`[fetchUserById] Fetching user with ID: ${userId}`);
	const usersCollection = collection(firestore, FirebaseCollections.USERS);
	const q = query(usersCollection, where("id", "==", userId));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("[fetchUserById] No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	console.log(`[fetchUserById] Found ${docs.length} matching documents.`);

	const user = docs[0].data();
	console.log(`[fetchUserById] User data: ${JSON.stringify(user, null, 2)}`);

	user.profile = await fetchProfileById(user.profileId);
	console.log(
		`[fetchUserById] User profile: ${JSON.stringify(user.profile)}`
	);

	try {
		user.items = await fetchItemsById(user.items);
		console.log(
			`[fetchUserById] User items: ${JSON.stringify(user.items)}`
		);
	} catch (e: any) {
		console.error(e);
	}

	return user as AppUser;
}

export async function fetchItemDetailsById(id: string): Promise<ItemDetails> {
	try {
		const itemsCollection = collection(
			firestore,
			FirebaseCollections.ITEMS
		);
		const docRef = doc(itemsCollection, id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data() as ItemDetails;
		} else {
			throw new Error("No such document!");
		}
	} catch (e: any) {
		console.error(e);
		return Promise.reject(e);
	}
}
export async function fetchProfileById(
	id: string
): Promise<Profile | undefined> {
	try {
		console.log(`[fetchProfileById] Fetching profile with ID: ${id}`);
		let profile: Profile | undefined;
		const profilesCollection = collection(
			firestore,
			FirebaseCollections.PROFILES
		);
		const profileRef = doc(profilesCollection, id);

		console.log(`[fetchProfileById] Profile ref: ${profileRef.path}`);
		const profileDoc = await getDoc(profileRef);

		if (!profileDoc.exists()) {
			console.log("[fetchProfileById] No such document!");
			return Promise.resolve(undefined);
		}

		profile = profileDoc.data() as Profile;
		console.log(
			`[fetchProfileById] Profile data: ${JSON.stringify(
				profile,
				null,
				2
			)}`
		);
		return profile;
	} catch (e: any) {
		console.error(e);
		return Promise.reject(e);
	}
}

export async function fetchAllItems(): Promise<Item[]> {
	try {
		const itemsCollection = collection(
			firestore,
			FirebaseCollections.LOST_ITEMS
		);
		const querySnapshot = await getDocs(itemsCollection);
		const items = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const data = doc.data();

				if (data) {
					data.item = await fetchItemDetailsById(data.item as string);
					data.found_lost_at = data.found_lost_at.seconds * 1000;
					if (data.ownerId?.length > 0) {
						data.owner = await fetchProfileById(data.ownerId);
					}
					const itemData = {
						id: doc.id,
						...(data as Item),
					};
					return itemData;
				} else {
					throw new Error(`Document ${doc.id} has no data`);
				}
			})
		);
		return items;
	} catch (e: any) {
		console.error("Error fetching items:", e);
		return Promise.reject(e);
	}
}
