
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCpS3IoeR4m8bmp9bEiA7oNyJHIj_0nuYc",
  authDomain: "soullift-audio-main-e7bb1.firebaseapp.com",
  projectId: "soullift-audio-main-e7bb1",
  storageBucket: "soullift-audio-main-e7bb1.firebasestorage.app",
  messagingSenderId: "358952171301",
  appId: "1:358952171301:web:927980488fe3b2c0820ccc",
  measurementId: "G-T7KDTMFVQ3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
