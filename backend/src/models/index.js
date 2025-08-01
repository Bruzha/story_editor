'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { fileURLToPath, URL } from 'url';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';
import configJson from '../config/config.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};
let sequelize;

console.log('Используется окружение:', env);

if (config.use_env_variable) {
  console.log('Используется переменная окружения:', config.use_env_variable);
  sequelize = new Sequelize(_env[config.use_env_variable], config);
} else {
  console.log('Используются параметры из config.json');
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log('__dirname:', __dirname);

readdirSync(__dirname)
  .filter((file) => {
    console.log('Проверка файла:', file);
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts' && file.indexOf('.test.ts') === -1;
  })
  .forEach(async (file) => {
    console.log('Загрузка модели из:', join(__dirname, file));
    try {
      const modelModule = await import(join(__dirname, file));
      if (!modelModule.default || typeof modelModule.default !== 'function') {
        console.warn(`Модуль ${file} не содержит export default или это не функция-фабрика`);
        return;
      }
      const model = modelModule.default(sequelize, DataTypes);
      console.log('Загружена модель:', model.name);
      db[model.name] = model;
    } catch (error) {
      console.error(`Ошибка при загрузке модели из ${file}:`, error);
    }
  });

const initializeAssociations = async () => {
  for (const modelName in db) {
    console.log('Вызов associate для', modelName);
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }
};

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    initializeAssociations();
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
