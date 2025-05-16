// Firestore.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyArVwgBnSq2AiTXTddCk1m5E6MzowfaAfI",
  authDomain: "sutstore-f4df4.firebaseapp.com",
  projectId: "sutstore-f4df4",
  storageBucket: "sutstore-f4df4.appspot.com",
  messagingSenderId: "122665206600",
  appId: "1:122665206600:web:a70838b0d69696aa63297d"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app); // ✅ ตั้งชื่อเป็น db

export { app, auth, db }; // ✅ export db
