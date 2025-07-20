import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

// Replace passport.authenticate() with Firebase token verification
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).send('Missing token');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};
