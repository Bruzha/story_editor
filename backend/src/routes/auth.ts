import express, { Router, Request, Response } from 'express';
import { register } from '../controllers/authController';

const router: Router = express.Router();

// Registration route
router.post('/register', async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  }
});

export default router;
