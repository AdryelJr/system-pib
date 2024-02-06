import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBimBlK1fd6hHJUU_oSSJVyFO_ywO0X9PY",
    authDomain: "pibunai-a6ca8.firebaseapp.com",
    databaseURL: "https://pibunai-a6ca8-default-rtdb.firebaseio.com",
    projectId: "pibunai-a6ca8",
    storageBucket: "pibunai-a6ca8.appspot.com",
    messagingSenderId: "876897031410",
    appId: "1:876897031410:web:b54ce51b0d67913531ac6b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase();
const storage = getStorage(app, "gs://my-custom-bucket");

export { app, db, auth, database, storage };