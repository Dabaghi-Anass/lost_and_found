export default {
	expo: {
		name: "lost_and_found",
		slug: "Lost & Found",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "lostandfound",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anass.lostandfound",
			icon: "./assets/icons/adaptive-icon.png",
		},
		android: {
			compileSdkVersion: 33,
			adaptiveIcon: {
				foregroundImage: "./assets/icons/adaptive-icon.png",
				backgroundColor: "#FFF8E3",
			},
			package: "com.anass.lostandfound",
			buildType: "apk",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
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
