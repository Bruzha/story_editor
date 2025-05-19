import express, { Request, Response, Router, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfile } from '../controllers/authController';
import { UserInstance } from '../models/User';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: UserInstance;
}
type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.get('/me', protect as ProtectMiddleware, (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.status(200).json({
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } else {
    res.status(404).json({ message: 'User not found' });
    return;
  }
});

router.get('/profile', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getProfile(req as AuthRequest, res, next);
});

export default router;
