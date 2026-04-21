import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuFMC1oFGRZbf4YbmPmsU6Qs6sVPFhyEw",
  authDomain: "ricemill-89192.firebaseapp.com",
  projectId: "ricemill-89192",
  storageBucket: "ricemill-89192.firebasestorage.app",
  messagingSenderId: "784784012449",
  appId: "1:784784012449:web:21525dfccde20c9bae6ce0",
  measurementId: "G-7NB2QNFEG2"
};

// Initialize Firebase (safely for Next.js SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only if running in the browser
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
