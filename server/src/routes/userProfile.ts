// server/src/routes/userProfile.ts
import express from 'express';
import { db } from '../firebase.ts';

const router = express.Router();

// GET /api/v2/user-profile/:uid
router.get('/:uid', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/v2/user-profile/:uid
router.post('/:uid', async (req, res) => {
  try {
    const data = { ...req.body, updatedAt: new Date() };
    await db.collection('users').doc(req.params.uid).set(data, { merge: true });
    res.json({ success: true, uid: req.params.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;