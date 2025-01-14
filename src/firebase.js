import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAGuRCuMYSsgNtKKyhc0Hqul1B5omMPuQc",
  authDomain: "crud-application-28173.firebaseapp.com",
  projectId: "crud-application-28173",
  storageBucket: "crud-application-28173.firebasestorage.app",
  messagingSenderId: "784974028944",
  appId: "1:784974028944:web:9ff318f9e9daa29947b815",
  measurementId: "G-NECLDPF2VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'tasks');

export { db, dbRef, push, set, onValue, update, ref };
