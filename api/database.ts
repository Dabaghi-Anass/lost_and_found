import { firestore } from "@/database/fire_base";
import { FirebaseCollections } from "@/lib/constants";
import { ItemDetails } from "@/types/entities.types";
import { addDoc, collection } from "firebase/firestore";

export async function uploadImagesToServer(
	pathes: string[]
): Promise<string[]> {
	return Promise.resolve(pathes);
}

export async function saveItemDetails(item: ItemDetails): Promise<ItemDetails> {
	console.log("Saving item details to database");
	try {
		const itemsCollection = collection(
			firestore,
			FirebaseCollections.ITEMS
		);
		const itemRef = await addDoc(itemsCollection, { ...item });
		console.log("Item details saved successfully", itemRef);
		return await Promise.resolve(item);
	} catch (e: any) {
		console.error(e);
		return await Promise.reject(e);
	}
}
