// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey/* "AIzaSyDzkTJREfcfEBdN8ozm6GclH2-kyu8UNUo" */,
  authDomain: process.env.REACT_APP_authDomain/* "taskclear-938f4.firebaseapp.com" */,
  projectId: process.env.REACT_APP_projectId/* "taskclear-938f4" */,
  storageBucket: process.env.REACT_APP_storageBucket/* "taskclear-938f4.appspot.com" */,
  messagingSenderId: process.env.REACT_APP_messagingSenderId/* "340816736153" */,
  appId: process.env.REACT_APP_appId/* "1:340816736153:web:1268a65439ae9f7934ad08" */,
  measurementId: process.env.REACT_APP_measurementId/* "G-8HHKP8P7Q7" */
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// export { db, auth };