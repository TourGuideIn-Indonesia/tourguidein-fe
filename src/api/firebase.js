import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let app = null;
let _auth = null;
let _db = null;

function getApp() {
  if (!app) {
    // Only initialize if config values are present
    if (!firebaseConfig.apiKey) {
      console.warn(
        "Firebase API key not configured. Firebase features will be unavailable.",
      );
      return null;
    }
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export const getFirebaseAuth = () => {
  if (!_auth) {
    const appInstance = getApp();
    if (!appInstance) return null;
    _auth = getAuth(appInstance);
  }
  return _auth;
};

export const getFirebaseDb = () => {
  if (!_db) {
    const appInstance = getApp();
    if (!appInstance) return null;
    _db = getFirestore(appInstance);
  }
  return _db;
};

// Keep backward-compatible exports (lazy getters)
export const auth = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getFirebaseAuth();
      if (!instance) return undefined;
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);

export const db = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getFirebaseDb();
      if (!instance) return undefined;
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);

export const firebaseSignIn = signInWithCustomToken;
