import { firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { AppUser, Item, ItemDetails, Profile } from "@/types/entities.types";
import { RecursiveFetcher } from "@/types/utils.types";
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

export async function fetchAllDocs<T>(
	collectionName: FirebaseCollections,
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {}
): Promise<T[]> {
	try {
		const docsCollection = collection(firestore, collectionName);
		const querySnapshot = await getDocs(docsCollection);
		const items = await Promise.all(
			querySnapshot.docs.map(async (document) => {
				const data = document.data();
				if (data) {
					let itemData: any = {
						id: document.id,
						...data,
					};
					itemData = await fetchInnerDocs(
						itemData,
						recursiveFetchers
					);
					itemData = applyConverters(itemData, convertersMap);
					return itemData as T;
				} else {
					throw new Error(`Document ${document.id} has no data`);
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
		let documentData = docs[0].data();
		if (documentData) {
			documentData = await fetchInnerDocs(
				documentData,
				recursiveFetchers
			);
			documentData = applyConverters(documentData, convertersMap);
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

async function fetchInnerDocs(data: any, fetchers: RecursiveFetcher[]) {
	for (const fetcher of fetchers) {
		const collectionRef = collection(firestore, fetcher.collectionName);
		const q = query(
			collectionRef,
			where(
				fetcher.idPropertyName,
				"==",
				data[fetcher.idPropertyName] || "__"
			)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			const docRef = doc(
				collectionRef,
				data[fetcher.idPropertyName] || "__"
			);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const innerData = docSnap.data();
				data[fetcher.propertyName] = innerData;
			} else {
				console.log(`Document ${data?.id} has no data`);
			}
		} else {
			const innerData = querySnapshot.docs[0].data();
			data[fetcher.propertyName] = innerData;
		}
	}

	return data;
}

function applyConverters(
	data: any,
	converters: Record<string, (data: any) => any>
) {
	for (const [key, converter] of Object.entries(converters)) {
		data[key] = converter(data[key]);
	}
	return data;
}
export async function searchDocs<T>(
	collectionName: FirebaseCollections,
	queryString: string,
	searchFields: string[],
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {}
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

	await Promise.all(
		querySnapShots.map((snapshot) => {
			snapshot.forEach(async (document) => {
				const data = document.data();
				let itemData: any = {
					id: document.id,
					...data,
				};
				itemData = await fetchInnerDocs(itemData, recursiveFetchers);
				itemData = applyConverters(itemData, convertersMap);
				allDocs.push(itemData as T);
			});
		})
	);

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
