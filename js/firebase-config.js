// Firebase Configuration for Royal Bites
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIkdWm6jPAb92heSbSwpB9pWR3gYW15-A",
    authDomain: "resturant-web-f16f3.firebaseapp.com",
    projectId: "resturant-web-f16f3",
    storageBucket: "resturant-web-f16f3.firebasestorage.app",
    messagingSenderId: "945475549627",
    appId: "1:945475549627:web:7e672fceb693de4713ac9e",
    measurementId: "G-DW50LY3G61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, addDoc, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
