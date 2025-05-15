import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
    try {
        const { login, email, password } = req.body;

        console.log('Received registration data:', { login, email, password }); // Логирование входных данных

        // Минимальная серверная валидация
        if (!login || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Логирование хешированного пароля

        // Create a new user in the database
        const User = require('../models/User')(require('../config/database').sequelize, require('sequelize').DataTypes);
        const newUser = await User.create({
            username: login,
            email: email,
            password: hashedPassword,
            firstName: null,
            lastName: null,
            role: 'user',
        });

        console.log('New user created:', newUser.toJSON());

        // Send a success response
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error: any) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
        if (error && error.name === "SequelizeError") { // Измененная проверка
            console.error('Sequelize Error:', error.errors);
        }
    }
};