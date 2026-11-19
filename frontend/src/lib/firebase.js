import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isDev = process.env.NODE_ENV === 'development';
const missingEnv = !process.env.REACT_APP_FIREBASE_API_KEY;

if (isDev && missingEnv) {
  console.warn(
    '[Rantau Firebase] REACT_APP_FIREBASE_API_KEY is not defined. Using local development fallback configuration.'
  );
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || (isDev ? 'AIzaSyDummyKeyForDevelopmentPreview123' : undefined),
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || (isDev ? 'rantau-dev.firebaseapp.com' : undefined),
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || (isDev ? 'rantau-dev' : undefined),
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || (isDev ? 'rantau-dev.appspot.com' : undefined),
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || (isDev ? '123456789012' : undefined),
  appId: process.env.REACT_APP_FIREBASE_APP_ID || (isDev ? '1:123456789012:web:abcdef123456' : undefined),
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const app = getApps()[0] || initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
