import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseApp(): App {
  if (getApps().length > 0) return getApps()[0]!

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey || privateKey.includes('YOUR_KEY_HERE')) {
    // If we return initializeApp without credentials, on local environments it tries to fetch Application Default Credentials and hangs forever!
    // We must provide a dummy certificate so it fails FASt (Permissions denied) rather than hanging.
    console.warn('Firebase Admin is missing credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY are set.')
    return initializeApp({
      credential: cert({
        projectId: 'demo-saqib-rice-mills',
        clientEmail: 'dummy@demo-saqib-rice-mills.iam.gserviceaccount.com',
        // PLACEHOLDER — real credentials must be set via env vars
        privateKey: '-----BEGIN PRIVATE KEY-----\nPLACEHOLDER_SET_ENV_VARS\n-----END PRIVATE KEY-----\n',
      }),
    })
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

const app = getFirebaseApp()
export const db = getFirestore(app)
