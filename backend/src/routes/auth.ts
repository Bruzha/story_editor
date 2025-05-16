import express, { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController'; //  <---  Импортируем функцию login

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

// Login route  <---  Добавляем маршрут для login
router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res); //  <---  Вызываем функцию login
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

export default router;
