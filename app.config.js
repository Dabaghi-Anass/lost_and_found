export default {
	expo: {
		name: "Lost And Found",
		slug: "lost_and_found",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "lostandfound",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anass.lostandfound",
			icon: "./assets/images/adaptive-icon.jpg",
		},
		android: {
			intentFilters: [
				{
					autoVerify: true,
					action: "VIEW",
					data: [
						{
							scheme: "lostandfound",
						},
					],
					category: ["BROWSABLE", "DEFAULT"],
				},
			],
			compileSdkVersion: 33,
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.jpg",
				backgroundColor: "#FFF8E3",
			},
			package: "com.anass.lostandfound",
			buildType: "apk",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
			headTags: [
				{
					tag: "meta",
					attributes: {
						charset: "utf-8",
					},
				},
				{
					tag: "meta",
					attributes: {
						name: "viewport",
						content: "width=device-width, initial-scale=1",
					},
				},
				{
					tag: "meta",
					attributes: {
						property: "og:title",
						content: "Lost & Found App - Find your lost items",
					},
				},
				{
					tag: "meta",
					attributes: {
						property: "og:description",
						content:
							"A convenient app to help you find lost items and report a found item developed by WISD/EID2 master students (Anass Dabaghi, Bilal Bouizdouzene).",
					},
				},
				{
					tag: "meta",
					attributes: {
						property: "og:image",
						content:
							"https://res.cloudinary.com/dnf11wb1l/image/upload/f_auto,q_auto/open_graph_image",
					},
				},
				{
					tag: "meta",
					attributes: {
						property: "og:url",
						content: "https://lost-and-found-wisd.expo.app",
					},
				},
			],
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
				},
			],
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
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
