import { auth, firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser, Item, ItemDetails, Profile } from "@/types/entities.types";
import { RecursiveFetcher } from "@/types/utils.types";
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
	updateDoc,
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

export async function fetchUserItemsById(
	id: string
): Promise<Item[] | undefined> {
	if (!id) return Promise.resolve(undefined);
	const itemsCollection = collection(
		firestore,
		FirebaseCollections.LOST_ITEMS
	);

	const q = query(itemsCollection, where("ownerId", "==", id));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
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
	const usersCollection = collection(firestore, FirebaseCollections.USERS);
	const q = query(usersCollection, where("id", "==", userId));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
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
		user.items = await fetchUserItemsById(user.id);
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

export async function fetchAllDocs<T>(
	collectionName: FirebaseCollections
): Promise<T[]> {
	try {
		const docsCollection = collection(firestore, collectionName);
		const querySnapshot = await getDocs(docsCollection);
		const items = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const data = doc.data();

				if (data) {
					const itemData = {
						id: doc.id,
						...(data as T),
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

export async function fetchDoc<T>(
	collectionName: FirebaseCollections,
	id: string,
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {}
): Promise<T | undefined> {
	try {
		const docsCollection = collection(firestore, collectionName);
		const q = query(docsCollection, where("id", "==", id));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			console.log("[fetchDoc] No matching documents found.");
			return Promise.resolve(undefined);
		}
		const docs: any = [];
		querySnapshot.forEach((doc) => docs.push(doc));
		const documentData = docs[0].data();
		console.log({ documentData });
		if (documentData) {
			for (const fetcher of recursiveFetchers) {
				const collectionRef = collection(
					firestore,
					fetcher.collectionName
				);
				const q = query(
					collectionRef,
					where(
						fetcher.idPropertyName,
						"==",
						documentData[fetcher.idPropertyName] || "__"
					)
				);
				const querySnapshot = await getDocs(q);
				if (querySnapshot.empty) {
					const docRef = doc(
						collectionRef,
						documentData[fetcher.idPropertyName] || "__"
					);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						const data = docSnap.data();
						documentData[fetcher.propertyName] = data;
					} else {
						console.log(`Document ${id} has no data`);
					}
				} else {
					const data = querySnapshot.docs[0].data();
					documentData[fetcher.propertyName] = data;
				}
			}
			for (const [key, converter] of Object.entries(convertersMap)) {
				documentData[key] = converter(documentData[key]);
			}
			return documentData as T;
		} else {
			throw new Error(`Document ${id} has no data`);
		}
	} catch (e: any) {
		console.error(e);
		return Promise.resolve(undefined);
	}
}

function _formQueryArray(queryString: string): string[] {
	let array: string[] = [];
	queryString.split("").forEach((char, i) => {
		//capitalize
		const capitalizedVersion =
			queryString.slice(0, 1).toUpperCase() + queryString.slice(1, i + 1);
		const lowerCaseVersion = queryString.slice(0, i + 1).toLowerCase();
		const upperCaseVersion = queryString.slice(0, i + 1).toUpperCase();
		array.push(
			capitalizedVersion,
			lowerCaseVersion,
			upperCaseVersion,
			queryString.slice(0, i + 1)
		);
	});
	return [...new Set(array as string[])];
}

export async function searchDocs<T>(
	collectionName: FirebaseCollections,
	queryString: string,
	searchFields: string[]
): Promise<T[] | undefined> {
	let allDocs: T[] = [];
	const collectionRef = collection(firestore, collectionName);
	const querySnapShots = await Promise.all(
		searchFields.map(async (field) => {
			const queryArray = _formQueryArray(queryString);
			const q = query(collectionRef, where(field, "in", queryArray));
			return getDocs(q);
		})
	);

	querySnapShots.forEach((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const itemData = {
				id: doc.id,
				...(data as T),
			};
			allDocs.push(itemData);
		});
	});

	//unique set of docs
	allDocs = allDocs.filter(
		(doc: any, index, self) =>
			index ===
			self.findIndex((t: any) => t.id === doc.id && t.id === doc.id)
	);

	return allDocs as T[];
}
export async function makeItemDelivred(
	itemId: string,
	ownerId: string
): Promise<boolean | undefined> {
	try {
		const db = firestore;
		await runTransaction(db, async (transaction: Transaction) => {
			const itemsCollection = collection(
				db,
				FirebaseCollections.LOST_ITEMS
			);
			const q = query(itemsCollection, where("id", "==", itemId));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				console.log("[item] No matching documents found.");
				return Promise.resolve(undefined);
			}

			const docs: any = [];
			querySnapshot.forEach((doc) => docs.push(doc.ref));
			if (docs.length > 0) {
				await updateDoc(docs[0], {
					delivered: true,
					realOwnerId: ownerId,
				});
			} else {
				throw new Error(`Document ${itemId} has no data`);
			}
		});
		return Promise.resolve(true);
	} catch (e: any) {
		console.error(e);
		return Promise.reject(e);
	}
}
