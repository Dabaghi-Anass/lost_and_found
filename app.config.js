export default {
	expo: {
		name: "lost_and_found",
		slug: "lost_and_found",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "myapp",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anass.lostandfound",
			googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			package: "com.anass.lostandfound",
			googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"@react-native-google-signin/google-signin",
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: "8be6cf47-305d-44ef-a87c-ecd6db8876dd",
			},
		},
		owner: "anassdabaghi",
	},
};
