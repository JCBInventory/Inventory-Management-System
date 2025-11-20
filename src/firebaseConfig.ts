import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj1Z60cnGLN06FKdW8dUQR3M8hidu2i9c",
  authDomain: "inventory-management-sys-bc7ae.firebaseapp.com",
  projectId: "inventory-management-sys-bc7ae",
  storageBucket: "inventory-management-sys-bc7ae.firebasestorage.app",
  messagingSenderId: "707480244864",
  appId: "1:707480244864:web:5a61971d3b882adae40c65"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
