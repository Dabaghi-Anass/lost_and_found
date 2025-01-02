import { GeolocationCoordinates } from "@/types/utils.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
const HERE_API_KEY = "1TAI29sgk05nFlHk1cTa47cUPOE2OXB25dhds34s8Ng";
export function cn(...classes: ClassValue[]) {
	return twMerge(clsx(...classes));
}

export async function getAddressFromCoordinates({
	latitude,
	longitude,
}: GeolocationCoordinates) {
	return new Promise((resolve) => {
		const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${HERE_API_KEY}&mode=retrieveAddresses&prox=${latitude},${longitude}`;
		fetch(url)
			.then((res) => res.json())
			.then((resJson) => {
				console.log("resJson", JSON.stringify(resJson, null, 2));
				if (resJson?.Response?.View?.[0]?.Result?.[0]) {
					resolve(
						resJson.Response.View[0].Result[0].Location.Address
							.Label
					);
				} else {
					resolve("unknown location");
				}
			})
			.catch((e) => {
				console.log("Error in getAddressFromCoordinates", e);
				resolve("unknown location");
			});
	});
}
