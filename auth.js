// auth.js — Authentication helpers
import { auth, db }    from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

// ── Map Firebase error codes to human-readable messages ─────
const AUTH_ERROR_MAP = {
  'auth/email-already-in-use':   'An account with this email already exists.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/weak-password':          'Password must be at least 6 characters.',
  'auth/user-not-found':         'No account found with this email.',
  'auth/wrong-password':         'Incorrect password. Please try again.',
  'auth/invalid-credential':     'Incorrect email or password.',
  'auth/too-many-requests':      'Too many failed attempts. Please try again later.',
  'auth/popup-closed-by-user':   'Sign-in popup was closed. Please try again.',
  'auth/unauthorized-domain':    'This domain is not authorised. Check Firebase Console.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

export function friendlyAuthError(code) {
  return AUTH_ERROR_MAP[code] || 'Something went wrong. Please try again.';
}

// ── Create user profile in Firestore ─────────────────────────
async function createUserProfile(user, extra = {}) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || extra.displayName || '',
      photoURL:    user.photoURL    || '',
      plan:        extra.plan       || 'standard',
      createdAt:   serverTimestamp(),
    });
  }
}

// ── Sign Up ───────────────────────────────────────────────────
export async function signUp({ email, password, displayName, plan }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserProfile(credential.user, { displayName, plan });
  return credential.user;
}

// ── Sign In ───────────────────────────────────────────────────
export async function signIn({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ── Google Sign In ────────────────────────────────────────────
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user);
  return result.user;
}

// ── Sign Out ──────────────────────────────────────────────────
export async function logOut() {
  await signOut(auth);
}

// ── Forgot Password ───────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Auth Guard (redirect if not logged in) ────────────────────
export function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// ── Redirect if already logged in ────────────────────────────
export function redirectIfLoggedIn(redirectTo = 'dashboard.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        window.location.href = redirectTo;
      } else {
        resolve(null);
      }
    });
  });
}

// ── Get current user (one-shot) ───────────────────────────────
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

export { onAuthStateChanged, auth };
