// firebase.js — Initialize Firebase
// Replace the config below with your actual Firebase config after setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ── FIREBASE CONFIG — cluster-saas-app ───────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDt6zKG2jW-vFP_6sshaUm68bdm9cThy44",
  authDomain:        "cluster-saas-app.firebaseapp.com",
  projectId:         "cluster-saas-app",
  storageBucket:     "cluster-saas-app.firebasestorage.app",
  messagingSenderId: "854411894403",
  appId:             "1:854411894403:web:7ad563ce0b290ea42445b6",
  measurementId:     "G-G22SHY4LPH",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
