// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgUmuWooGmKiMKnVcVAGFWcYNkfLCiZPo",
  authDomain: "to-do-list-bd058.firebaseapp.com",
  projectId: "to-do-list-bd058",
  storageBucket: "to-do-list-bd058.firebasestorage.app",
  messagingSenderId: "368974384240",
  appId: "1:368974384240:web:0508734d2540de1e1a78b5",
  measurementId: "G-WB4JKWBCTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;