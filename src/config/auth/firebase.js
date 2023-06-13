// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAY4kqwcUiAapplzKzBCZ2DN4sJWJcecuY',
  authDomain: 'rndev-60404.firebaseapp.com',
  projectId: 'rndev-60404',
  storageBucket: 'rndev-60404.appspot.com',
  messagingSenderId: '298707374166',
  appId: '1:298707374166:web:abe1617003df1a62d16bf7',
  measurementId: 'G-3V9J6V5HZG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {auth, db, storage, app};
