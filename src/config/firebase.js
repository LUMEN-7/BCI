import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCpb7RupHyj5X3nDHlEtfN4U9mVQemrRo",
  authDomain: "primordial-veld-437611-u8.firebaseapp.com",
  projectId: "primordial-veld-437611-u8",
  storageBucket: "primordial-veld-437611-u8.firebasestorage.app",
  messagingSenderId: "487635748207",
  appId: "1:487635748207:web:c71d4084657a20f3ac549a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);