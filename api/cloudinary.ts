import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { Alert, Platform } from "react-native";
import { Toast } from "toastify-react-native";
const manipulateAsync = require("expo-image-manipulator").manipulateAsync;
/**
 * Uploads an image to cloudinary cloud storage and returns the url of the uploaded image
 * @param {ImagePickerAsset} asset The image to upload
 * @returns The url of the uploaded image
 */
export async function uploadAsset(asset: ImagePickerAsset) {
	if (Platform.OS === "web") {
		try {
			//fetch the asset and convert it to a blob then send it
			const imageData = await fetch(asset.uri);
			const blob = await imageData.blob();
			const formData = new FormData();
			let file = new File([blob], asset.fileName || "image.jpg", {
				type: asset.mimeType,
			});
			formData.append("file", file);
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
			Toast.error("Failed to upload image", "bottom");
			return "";
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
			Toast.error("Failed to upload image", "bottom");
		}
	}
}
