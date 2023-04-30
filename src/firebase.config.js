// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA3AWztkenb_4X6FrMcxPEkRO8_d9DjkzM',
  authDomain: 'otp-verification-46735.firebaseapp.com',
  projectId: 'otp-verification-46735',
  storageBucket: 'otp-verification-46735.appspot.com',
  messagingSenderId: '928237336703',
  appId: '1:928237336703:web:6ccf3e39ec0e874390a74a',
  measurementId: 'G-9QK5YP2PVQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
