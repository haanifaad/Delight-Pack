import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key_for_build",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

function assertFirebaseConfig(): void {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ] as const;

  const missing = required.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    console.warn(
      `[Firebase] Missing environment variables: ${missing.join(', ')}. ` +
        'Authentication will not work until they are configured.',
    );
  }
}

assertFirebaseConfig();

import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Persist sessions in IndexedDB (Firebase default for local persistence).
// Tokens are managed by the SDK — never store ID tokens in localStorage manually.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Failed to set browser local persistence, falling back to inMemoryPersistence:', err);
  return setPersistence(auth, inMemoryPersistence);
});

export { app, auth, storage, functions, assertFirebaseConfig };
