// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// --- ROTA DE REGISTRO (POST /api/auth/register) ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Este email já está em uso.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário no banco
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Gera o token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Remove a senha da resposta
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json({ token, user: userResponse });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
});

// --- ROTA DE LOGIN (POST /api/auth/login) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Procura o usuário pelo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Compara a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Remove a senha da resposta
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({ token, user: userResponse });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

module.exports = router;