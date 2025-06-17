// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdbqDRbflmueQVdbhS0uX2_0TWwJdIKXM",
  authDomain: "cv-web-b0445.firebaseapp.com",
  projectId: "cv-web-b0445",
  storageBucket: "cv-web-b0445.appspot.com", // ✅ corregido
  messagingSenderId: "43928600371",
  appId: "1:43928600371:web:e8e5726a8f88e69c9b4846"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.db = db;
window.auth = auth;
