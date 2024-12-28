import { ItemDetails } from "@/types/entities.types";
import firebase from "@react-native-firebase/app";

export async function uploadImagesToServer(
	pathes: string[]
): Promise<string[]> {
	return [];
}

export async function saveItemDetails(item: ItemDetails): Promise<ItemDetails> {
	const app = firebase.app();
	console.log(app);
	// const itemRef = firestore().collection('items').doc(item.id);
	// await itemRef.set(item);

	return await Promise.resolve(item);
}
