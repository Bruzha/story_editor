'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';
import configJson from '../config/config.json'; // импортируем config как JSON
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
    const modelModule = await import(join(__dirname, file)); // Динамический импорт
    if (!modelModule.default) {
      console.warn(`Модуль ${file} не содержит export default`);
      return;
    }
    const model = modelModule.default(sequelize, DataTypes); // Доступ к экспорту по умолчанию
    console.log('Загружена модель:', model.name); // Log the model name
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  console.log('Вызов associate для', modelName); // Log before calling associate
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
