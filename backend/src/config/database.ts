import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'story_editor',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'Rikki&25*2R0i0k5k?2i5',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  }
);
