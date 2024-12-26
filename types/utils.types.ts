/*-----------------enums------------------*/

enum Role {
	ADMIN = "admin",
	USER = "user",
}

enum ItemStatus {
	FORM_SUBMITTED = "form submitted",
	UNDER_REVIEW = "form approved",
	FOUND_MATCHES = "found matches",
}
type GeolocationCoordinates = {
	latitude: number;
	longitude: number;
};
export { GeolocationCoordinates, ItemStatus, Role };
