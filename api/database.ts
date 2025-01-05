import { firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser, Item, ItemDetails, Profile } from "@/types/entities.types";
import { ImagePickerAsset } from "expo-image-picker";
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

export async function fetchItemById(itemId: string): Promise<Item | undefined> {
	const itemsCollection = collection(
		firestore,
		FirebaseCollections.LOST_ITEMS
	);
	const q = query(itemsCollection, where("id", "==", itemId));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	const item = docs[0].data();
	item.item = await fetchItemDetailsById(item.item);
	item.found_lost_at = new Date(item.found_lost_at.seconds * 1000);
	return item as Item;
}

export async function fetchUserById(
	userId: string
): Promise<AppUser | undefined> {
	const usersCollection = collection(firestore, FirebaseCollections.USERS);
	const q = query(usersCollection, where("id", "==", userId));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log("No matching documents found.");
		return Promise.resolve(undefined);
	}

	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc));
	const user = docs[0].data();
	user.profile = await fetchProfileById(user.profileId);
	user.items = await Promise.all(
		user.items.map((itemId: string) => {
			return fetchItemById(itemId);
		})
	);
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

export async function fetchProfileById(id: string): Promise<Profile> {
	try {
		const itemsCollection = collection(
			firestore,
			FirebaseCollections.PROFILES
		);
		const docRef = doc(itemsCollection, id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data() as Profile;
		} else {
			throw new Error("No such document!");
		}
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
					data.found_lost_at = new Date(
						data.found_lost_at.seconds * 1000
					);
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
