import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { Alert, Platform } from "react-native";
const manipulateAsync = require("expo-image-manipulator").manipulateAsync;

let cloudinaryConnection: {
	uploadImage: (url: string, fileName: string) => Promise<any>;
	optimizeUrl: (publicName: string) => string;
};

export async function uploadAsset(asset: ImagePickerAsset) {
	if (Platform.OS === "web") {
		try {
			console.log(asset);
			const formData = new FormData();
			// formData.append("file", {
			// 	uri: asset.uri,
			// 	type: asset.mimeType,
			// 	name: asset.fileName,
			// } as any);

			// formData.append("api_key", "936119415866171");
			// formData.append("upload_preset", "lost_and_found_items_images");

			// const response = await axios.post(
			// 	"https://api.cloudinary.com/v1_1/dnf11wb1l/image/upload",
			// 	formData,
			// 	{
			// 		headers: {
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );

			// return response.data.secure_url;
			return "https://via.placeholder.com/300";
		} catch (e: any) {
			Alert.alert("Error", "Failed to upload image");
		}
	} else {
		const resizedAsset = await manipulateAsync(
			asset.uri,
			[{ resize: { width: 500, height: 500 } }],
			{ compress: 1, format: "jpeg" }
		);

		asset.uri = resizedAsset.uri;
		try {
			const formData = new FormData();
			formData.append("file", {
				uri: asset.uri,
				type: asset.mimeType,
				name: asset.fileName,
			} as any);

			formData.append("api_key", "936119415866171");
			formData.append("upload_preset", "lost_and_found_items_images");

			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/dnf11wb1l/image/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			return response.data.secure_url;
		} catch (e: any) {
			Alert.alert("Error", "Failed to upload image");
		}
	}
}
