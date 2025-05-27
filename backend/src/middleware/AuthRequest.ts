import { Request } from 'express';
import { UserInstance } from '../models/User';

export default interface AuthRequest extends Request {
  user?: UserInstance;
}
