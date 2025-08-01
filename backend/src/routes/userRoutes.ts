import express, { Request, Response, Router } from 'express';
import { UserInstance } from '../models/User';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: UserInstance;
}

router.get('/me', (req: AuthRequest, res: Response) => {
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

export default router;
