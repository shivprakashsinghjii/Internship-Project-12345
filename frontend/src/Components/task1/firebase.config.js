import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDljqHzyisrEqQRL-FGjiYEJboyU2uedFQ",
  authDomain: "internship-647f0.firebaseapp.com",
  projectId: "internship-647f0",
  storageBucket: "internship-647f0.appspot.com",
  messagingSenderId: "855786999739",
  appId: "1:855786999739:web:14c3b70ca932a1c51dbe9e",
  measurementId: "G-84BWMHJJEB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
