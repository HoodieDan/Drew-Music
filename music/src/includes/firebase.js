import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAVl-DPNXYgeoGENCRTUhLk5eqoBzMlqBw',
  authDomain: 'music-4d30a.firebaseapp.com',
  projectId: 'music-4d30a',
  storageBucket: 'music-4d30a.appspot.com',
  messagingSenderId: '323173063008',
  appId: '1:323173063008:web:5f705d87eaf4e4cd502605',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const commentsCollection = collection(db, 'comments');

export {
  db,
  storage,
  commentsCollection,
};
