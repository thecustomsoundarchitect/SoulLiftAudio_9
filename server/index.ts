// server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userProfileRouter from './src/routes/userProfile.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v2/user-profile', userProfileRouter);

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 Server ready on :${PORT}`));