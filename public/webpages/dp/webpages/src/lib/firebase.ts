import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
void setPersistence(auth, browserLocalPersistence);

export { app, auth, storage, functions, assertFirebaseConfig };
