import express from 'express';
import { getHealth } from '../controllers/sampleController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

router.get('/health', getHealth);

export default router;
