"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// /server/src/firebase.ts
var firebase_admin_1 = require("firebase-admin");
if (!firebase_admin_1.default.apps.length) {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL)
        throw new Error('Missing Firebase secrets');
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}
exports.db = firebase_admin_1.default.firestore();
