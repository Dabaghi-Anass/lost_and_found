import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const apiKey = "AIzaSyBgcY1lLBTPmSV3K1x59JSdc0uTo0P4L4w";
const authDomain = "lost-and-found-master-1b6c7.firebaseapp.com";
const projectId = "lost-and-found-master-1b6c7";
const storageBucket = "lost-and-found-master-1b6c7.firebasestorage.app";
const messagingSenderId = "1084224482940";
const appId = "1:1084224482940:web:aee047cfc683e48188a3f9";
const measurementId = "G-38S7B64CS0";

// const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
// const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
// const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
// const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
// const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
// const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
// const measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

const firebaseConfig: FirebaseOptions = {
	apiKey,
	authDomain,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId,
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore();
export const auth = getAuth(app);
