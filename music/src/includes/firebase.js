import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { collection, getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.DREW_MUSIC_API_KEY,
  authDomain: process.env.DREW_MUSIC_AUTH_DOMAIN,
  projectId: process.env.DREW_MUSIC_PROJECT_ID,
  storageBucket: process.env.DREW_MUSIC_STORAGE_BUCKET,
  messagingSenderId: process.env.DREW_MUSIC_MESSAGING_SENDER_ID,
  appId: process.env.DREW_MUSIC_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

enableIndexedDbPersistence(db);

const commentsCollection = collection(db, 'comments');

export {
  db,
  storage,
  commentsCollection,
};
