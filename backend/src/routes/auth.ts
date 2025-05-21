import express, { Router, Request, Response, NextFunction } from 'express';
import { register, login, reset_password, check_email, getProfile, updateProfile } from '../controllers/authController';
import { getProjects, getIdeas, getPlotlines, getProjectById } from '../controllers/getDataCards';
import { protect } from '../middleware/authMiddleware';
import { UserInstance } from '../models/User';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: UserInstance;
}

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

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
  try {
    await check_email(req, res);
  } catch (error) {
    console.error('Error during check-email:', error);
    res.status(500).send('Check-email failed');
  }
});

//Маршрут для получения профиля
router.get('/profile', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getProfile(req as AuthRequest, res, next);
});

// Update profile route
router.put('/profile', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateProfile(req as AuthRequest, res, next);
});

//Маршрут для получения проектов
router.get('/projects', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getProjects(req as AuthRequest, res, next);
});

//Маршрут для получения идей
router.get('/ideas', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getIdeas(req as AuthRequest, res, next);
});

//Маршрут для получения сюжетных линий
router.get('/plotlines', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getPlotlines(req as AuthRequest, res, next);
});

//Маршрут для получения информации по проекту
router.get('/projects/:projectId', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getProjectById(req as AuthRequest, res, next);
});

export default router;
