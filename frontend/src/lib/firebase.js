import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDummyKeyForDevelopmentPreview123',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'rantau-dev.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'rantau-dev',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'rantau-dev.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const app = getApps()[0] || initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
