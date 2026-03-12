import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let dbPromise: Promise<Firestore> | null = null

export function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const { initializeApp, getApps } = await import('firebase/app')
      const { getFirestore } = await import('firebase/firestore')
      const app =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      return getFirestore(app)
    })()
  }
  return dbPromise
}

/** Call when RSVP section enters viewport to preload Firebase */
export function preloadFirebase(): void {
  getDb()
}
