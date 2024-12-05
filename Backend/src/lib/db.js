import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBeUbCal73EDoqbzbSccHQRW68ahFau_PI",
    authDomain: "gas-agency-system-b5e99.firebaseapp.com",
    projectId: "gas-agency-system-b5e99",
    storageBucket: "gas-agency-system-b5e99.firebasestorage.app",
    messagingSenderId: "626719288395",
    appId: "1:626719288395:web:ced10e412d6f4af782b1ce",
    databaseURL: "https://gas-agency-system-b5e99-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const realdb = getDatabase(app);
