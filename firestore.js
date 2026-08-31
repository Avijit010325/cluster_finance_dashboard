// firestore.js — Firestore helper functions
import { db } from './firebase.js';
import {
  doc, getDoc, setDoc, updateDoc, addDoc,
  collection, serverTimestamp, query, where, getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ── User Profile ──────────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data });
}

// ── Subscription ──────────────────────────────────────────────
export async function getSubscription(uid) {
  const snap = await getDoc(doc(db, 'subscriptions', uid));
  return snap.exists() ? snap.data() : null;
}

export async function setSubscription(uid, plan) {
  await setDoc(doc(db, 'subscriptions', uid), {
    uid,
    plan,
    status:    'active',
    startDate: serverTimestamp(),
  });
}

// ── Contact Form ──────────────────────────────────────────────
export async function submitContactForm({ name, email, message }) {
  await addDoc(collection(db, 'contacts'), {
    name,
    email,
    message,
    status:    'new',
    createdAt: serverTimestamp(),
  });
}
