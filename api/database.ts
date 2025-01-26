import { auth, firestore } from "@/database/fire_base";
import { WhereClose } from "@/hooks/useFetch";
import { FirebaseCollections } from "@/lib/constants";
import { setCurrentUser } from "@/redux/global/current-user";
import { AppUser, Item, ItemDetails, Profile } from "@/types/entities.types";
import { RecursiveFetcher } from "@/types/utils.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImagePickerAsset } from "expo-image-picker";
import { deleteUser } from "firebase/auth";
import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentData,
	DocumentReference,
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
		const itemRef = await addDoc(itemsCollection, {
			...item,
			id: doc(itemsCollection).id,
		});
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
				itemId: itemDetailsRef.id,
				item: itemDetailsRef.id,
			};

			await addDoc(itemsCollection, itemToSave);

			itemToSaveClone = {
				...itemToSave,
				item: item.item,
				itemId: itemDetailsRef.id,
			};
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
				...(user?.profile as Profile),
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

			userToSaveClone = { ...userToSave, profile: user?.profile };
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
	user.profile = await fetchProfileById(user?.profileId);
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
	convertersMap: Record<string, (data: any) => any> = {},
	whereClose: WhereClose[] = []
): Promise<T[]> {
	try {
		const docsCollection = collection(firestore, collectionName);
		const q = query(
			docsCollection,
			...whereClose.map((whereClose) =>
				where(whereClose.fieldPath, whereClose.opStr, whereClose.value)
			)
		);
		const querySnapshot = await getDocs(q);
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

export async function fetchDocsWithIds<T>(
	collectionName: FirebaseCollections,
	ids: string[] | undefined,
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {}
): Promise<T[]> {
	console.log({ ids });
	if (!ids || ids.length === 0) return Promise.resolve([]);
	try {
		const docsCollection = collection(firestore, collectionName);
		const q = query(docsCollection, where("id", "in", ids));

		const querySnapshot = await getDocs(q);
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

export async function fetchItemsOfUser(
	id: string | undefined,
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {}
): Promise<Item[]> {
	if (!id) return Promise.resolve([]);
	try {
		const docsCollection = collection(
			firestore,
			FirebaseCollections.LOST_ITEMS
		);
		const q = query(docsCollection, where("ownerId", "==", id));

		const querySnapshot = await getDocs(q);
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
					return itemData as Item;
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

export async function deleteAllItemsOfUser(
	id: string | undefined
): Promise<boolean> {
	if (!id) return Promise.resolve(false);
	try {
		const docsCollection = collection(
			firestore,
			FirebaseCollections.LOST_ITEMS
		);
		const itemsDetailsCollection = collection(
			firestore,
			FirebaseCollections.ITEMS
		);
		const q = query(docsCollection, where("ownerId", "==", id));
		const snapshot = await getDocs(q);
		const itemsToDeleteIds = snapshot.docs.map(
			(doc) => doc?.data()?.itemId || "test"
		);
		const itemsReferences = snapshot.docs
			.map((doc) => doc.ref)
			.concat(
				itemsToDeleteIds.map((id) => doc(itemsDetailsCollection, id))
			);
		await Promise.all(itemsReferences.map((ref) => deleteDoc(ref)));
		return Promise.resolve(true);
	} catch (e: any) {
		console.error("Error fetching items:", e);
		return Promise.reject(e);
	}
}

export async function fetchDoc<T>(
	collectionName: FirebaseCollections,
	id: string,
	recursiveFetchers: RecursiveFetcher[] = [],
	convertersMap: Record<string, (data: any) => any> = {},
	whereCloses: WhereClose[] = []
): Promise<T | undefined> {
	try {
		const docsCollection = collection(firestore, collectionName);
		whereCloses.push({ fieldPath: "id", opStr: "==", value: id });
		let q = query(
			docsCollection,
			...whereCloses.map((whereClose) =>
				where(whereClose.fieldPath, whereClose.opStr, whereClose.value)
			)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			console.log("[fetchDoc] No matching documents found.");
			const docRef = doc(docsCollection, id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const documentData = docSnap.data();
				let itemData: any = {
					id: docSnap.id,
					...documentData,
				};
				itemData = await fetchInnerDocs(itemData, recursiveFetchers);
				itemData = applyConverters(itemData, convertersMap);
				return itemData as T;
			} else {
				throw Promise.resolve(undefined);
			}
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
	if (fetchers.length === 0) return data;
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
				const profilesCollection = collection(
					firestore,
					FirebaseCollections.PROFILES
				);
				const userProfileSearchQuery = query(
					profilesCollection,
					where("id", "==", ownerId)
				);

				const snapshot = await getDocs(userProfileSearchQuery);
				if (snapshot.empty) {
					throw new Error(`Document ${itemId} has no data`);
				}
				const profileRef = snapshot.docs[0].ref;
				const profile = await updateDoc(docs[0], {
					delivered: true,
					deliveredAt: new Date(),
					realOwnerId: profileRef.id,
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
export async function updateItem(
	itemId: string,
	newItem: ItemDetails
): Promise<boolean | undefined> {
	try {
		await runTransaction(firestore, async (transaction: Transaction) => {
			const itemsCollection = collection(
				firestore,
				FirebaseCollections.ITEMS
			);
			const itemRef = doc(itemsCollection, itemId);
			await updateDoc(itemRef, { ...newItem });
			return true;
		});
		return Promise.resolve(true);
	} catch (e: any) {
		console.error(e);
		return Promise.reject(e);
	}
}

export async function getUserById(id: string) {
	if (!id) return Promise.resolve(undefined);
	const user = await fetchDoc<AppUser>(FirebaseCollections.USERS, id, [
		{
			collectionName: FirebaseCollections.PROFILES,
			idPropertyName: "profileId",
			propertyName: "profile",
		},
	]);
	return user;
}

export async function deleteDocumentById(
	collectionName: FirebaseCollections,
	id: string
) {
	const q = query(
		collection(firestore, collectionName),
		where("id", "==", id)
	);
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		console.log("[deleteDocumentById] No matching documents found.");
		return Promise.resolve(undefined);
	}
	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc.ref));
	if (docs.length > 0) {
		await deleteDoc(docs[0]);
	} else {
		const ref = doc(collection(firestore, collectionName), id);
		await deleteDoc(ref);
	}
	return Promise.resolve(true);
}

export async function deleteItemById(itemId: string) {
	if (!itemId) return Promise.resolve(undefined);
	const q = query(
		collection(firestore, FirebaseCollections.LOST_ITEMS),
		where("id", "==", itemId)
	);
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		console.log("[deleteDocumentById] No matching documents found.");
		return Promise.resolve(undefined);
	}
	const docs: DocumentReference<DocumentData, DocumentData>[] = [];
	querySnapshot.forEach((doc) => docs.push(doc.ref));
	if (docs.length > 0) {
		const itemDataSnap = await getDoc(docs[0]);
		const itemData = itemDataSnap.data();
		if (itemData) {
			const itemDetailsRef = doc(
				collection(firestore, FirebaseCollections.ITEMS),
				itemData.itemId
			);
			await Promise.all([deleteDoc(docs[0]), deleteDoc(itemDetailsRef)]);
		}
	} else {
		const ref = doc(
			collection(firestore, FirebaseCollections.LOST_ITEMS),
			itemId
		);
		const itemDataRef = await getDoc(ref);
		const itemData = itemDataRef.data();
		if (!itemData) return Promise.resolve(true);
		const itemDetailsRef = doc(
			collection(firestore, FirebaseCollections.ITEMS),
			itemData.itemId
		);
		await Promise.all([deleteDoc(ref), deleteDoc(itemDetailsRef)]);
	}
	return Promise.resolve(true);
}

export async function updateProfile(
	id: string | undefined,
	newProfile: Profile
): Promise<Profile | null> {
	if (!id || !newProfile || [...Object.keys(newProfile)].length === 0)
		return Promise.resolve(null);
	try {
		await runTransaction(firestore, async (transaction: Transaction) => {
			const profilesCollection = collection(
				firestore,
				FirebaseCollections.PROFILES
			);
			const profileRef = doc(profilesCollection, id);
			await updateDoc(profileRef, { ...newProfile });
		});
		return Promise.resolve(newProfile);
	} catch (e: any) {
		console.log(e);
		return Promise.resolve(null);
	}
}

export async function deleteAccount(user?: AppUser) {
	if (!user) return Promise.resolve(false);
	try {
		await runTransaction(firestore, async (transaction: Transaction) => {
			if (auth.currentUser) {
				await deleteUser(auth.currentUser);
				await AsyncStorage.removeItem("userID");
			}
			const usersCollection = collection(
				firestore,
				FirebaseCollections.USERS
			);
			const profilesCollection = collection(
				firestore,
				FirebaseCollections.PROFILES
			);
			const [userRef, items] = await Promise.all([
				findDocRefById(usersCollection, user.id),
				fetchItemsOfUser(user.id),
			]);
			const profileRef = doc(profilesCollection, user.profileId);
			await Promise.all([
				deleteDoc(userRef),
				deleteDoc(profileRef),
				deleteAllItemsOfUser(user.id),
			]);
		});
		return Promise.resolve(true);
	} catch (e: any) {
		console.error(e);
		return Promise.resolve(false);
	}
}

async function findDocRefById(coll: CollectionReference, id?: string) {
	if (!id) return Promise.resolve(undefined);
	const q = query(coll, where("id", "==", id));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		console.log("[findDocRefById] No matching documents found.");
		return Promise.resolve(undefined);
	}
	const docs: any = [];
	querySnapshot.forEach((doc) => docs.push(doc.ref));
	return docs[0];
}

export async function refetchCurrentUserFromDb(): Promise<AppUser | undefined> {
	const id = await AsyncStorage.getItem("userID");
	if (id) {
		const user = await getUserById(id);
		setCurrentUser(user);
		return user;
	}
	return Promise.resolve(undefined);
}
