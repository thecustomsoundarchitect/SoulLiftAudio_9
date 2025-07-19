// src/routes/userProfile.js
import express from 'express';
const router = express.Router();

// GET user profile
router.get('/', (req, res) => {
  res.json({ message: 'User profile endpoint working' });
});

// POST create/update user profile
router.post('/', (req, res) => {
  res.json({ message: 'User profile created/updated' });
});

export default router;