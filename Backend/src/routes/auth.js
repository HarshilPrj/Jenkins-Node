const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../model/user');
require('dotenv').config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Customer Registration
router.post('/register/customer', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'customer',
            verificationToken: verificationToken,
        });

        const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>`,
        });

        res.status(201).json({ message: 'Customer registered. Check email for verification.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Registration
router.post('/register/admin', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'admin',
            verificationToken: verificationToken,
        });

        const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>`,
        });

        res.status(201).json({ message: 'Admin registered. Check email for verification.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify Email
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ where: { verificationToken: req.params.token } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid verification token.' });
        }
        user.verified = true;
        user.verificationToken = null;
        await user.save();
        res.send('Email verified successfully!');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Login
router.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid credentials or not an admin.' });
        }
        if (!user.verified) {
            return res.status(401).json({ message: 'Email not verified' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
