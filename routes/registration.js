const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const sequelize = require('../models/database');
const { ChatUser } = require('../models/chatuser');

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('recieved a new reg req', username, email, password);

    // Check if user already exists
    const existingUser = await ChatUser.findOne({ where: { email } });
    console.log('checking users...');
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash the password
    console.log('hashing...');
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    console.log(hashedPassword);

    // Create a new user
    try {
        console.log('creating new...');
        const newUser = await ChatUser.create({
            username,
            email,
            password_hash: hashedPassword
        });
        console.log(newUser);
        return res.status(201).json({ user: { id: newUser.id, username: newUser.username, email: newUser.email } });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({ errors: error.errors.map(e => e.message) });
        }
        
        return res.status(500).json({ error: 'Error registering user.' });
    }
    
});

module.exports = router;
