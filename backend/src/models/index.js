'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { fileURLToPath, URL } from 'url'; // Import fileURLToPath and URL
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';
import configJson from '../config/config.json'; // импортируем config как JSON

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};
let sequelize;

console.log('Используется окружение:', env); // Log the environment

if (config.use_env_variable) {
  console.log('Используется переменная окружения:', config.use_env_variable); // Log the env variable
  sequelize = new Sequelize(_env[config.use_env_variable], config);
} else {
  console.log('Используются параметры из config.json'); // Log if config.json is used
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log('__dirname:', __dirname); // Log __dirname

readdirSync(__dirname)
  .filter((file) => {
    console.log('Проверка файла:', file); // Log the file being checked
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' && //  Changed to .ts
      file.indexOf('.test.ts') === -1 //  Changed to .ts
    );
  })
  .forEach(async (file) => {
    console.log('Загрузка модели из:', join(__dirname, file)); // Log the file being loaded
    try {
      const modelModule = await import(join(__dirname, file)); // Динамический импорт
      if (!modelModule.default || typeof modelModule.default !== 'function') {
        console.warn(`Модуль ${file} не содержит export default или это не функция-фабрика`);
        return;
      }
      const model = modelModule.default(sequelize, DataTypes); // Доступ к экспорту по умолчанию
      console.log('Загружена модель:', model.name); // Log the model name
      db[model.name] = model;
    } catch (error) {
      console.error(`Ошибка при загрузке модели из ${file}:`, error);
    }
  });

// После загрузки всех моделей, вызываем associate
const initializeAssociations = async () => {
  for (const modelName in db) {
    console.log('Вызов associate для', modelName); // Log before calling associate
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }
};

// Call initializeAssociations after all models are loaded
// This is important to ensure all models are loaded before associations are set up
sequelize
  .sync() // Or use sequelize.sync({ force: true }) to drop and recreate tables (use with caution!)
  .then(() => {
    console.log('Database synced');
    initializeAssociations(); // Initialize associations after sync
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
