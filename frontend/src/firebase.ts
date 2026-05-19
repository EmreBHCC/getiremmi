// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-xPtZZT-NGPyd1XtD5Gl0_YirTNKFZlg",
    authDomain: "getiremmi.firebaseapp.com",
    projectId: "getiremmi",
    storageBucket: "getiremmi.firebasestorage.app",
    messagingSenderId: "486556657472",
    appId: "1:486556657472:web:e77e10f382858890fbfca5",
    measurementId: "G-2VQQMVVT2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);