
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Always resolve .env relative to the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import admin from 'firebase-admin';

console.log('🔍 Firebase env check:');
console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY?.length);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    } as any),
  });
}

export const db = admin.firestore();
