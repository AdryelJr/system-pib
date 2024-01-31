import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

export { app, db, auth };