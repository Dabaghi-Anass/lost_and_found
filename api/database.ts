import { firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { Item, ItemDetails } from "@/types/entities.types";
import { ImagePickerAsset } from "expo-image-picker";
import {
	addDoc,
	collection,
	runTransaction,
	Transaction,
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
