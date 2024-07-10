// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-77b34.firebaseapp.com",
  projectId: "real-estate-77b34",
  storageBucket: "real-estate-77b34.appspot.com",
  messagingSenderId: "1002994877669",
  appId: "1:1002994877669:web:8c210c76c24b8b6605000c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);