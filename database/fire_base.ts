import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
const firebaseConfig = {
	apiKey: "AIzaSyCJE1DvPOeQlgmjhZh40ooOo1H-00hlrKE",
	authDomain: "lost-and-found-446016.firebaseapp.com",
	projectId: "lost-and-found-446016",
	storageBucket: "lost-and-found-446016.firebasestorage.app",
	messagingSenderId: "283270669062",
	appId: "1:283270669062:web:6ba039b8612aa8e013b487",
	measurementId: "G-QRVXQ24ZWG",
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const firestore: Firestore = getFirestore(app);
// export const auth = initializeAuth(app, {
// 	persistence: getReactNativePersistence(AsyncStorage),
// });

export const auth = getAuth(app);
