import express, { Router, Request, Response } from 'express';
import { register, login, reset_password, check_email } from '../controllers/authController'; //  <---  Импортируем check_email

const router: Router = express.Router();

//Маршрут для регистрации
router.post('/register', async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  }
});

//Маршрут для авторизации
router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

//Маршрут для смены пароля
router.put('/reset-password', async (req: Request, res: Response) => {
  try {
    await reset_password(req, res);
  } catch (error) {
    console.error('Error during reset-password:', error);
    res.status(500).send('Reset-password failed');
  }
});

//Маршрут для проверки email
router.post('/check-email', async (req: Request, res: Response) => {
  //  <---  Добавляем маршрут для check_email
  try {
    await check_email(req, res);
  } catch (error) {
    console.error('Error during check-email:', error);
    res.status(500).send('Check-email failed');
  }
});

export default router;
