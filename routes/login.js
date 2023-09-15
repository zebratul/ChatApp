const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ChatUser } = require('../models/chatuser');

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log('recieved a login req', email, password);

    // Check if the user exists
    const user = await ChatUser.findOne({ where: { email } });
    if (!user) {
        console.log('no user');
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
        console.log('wrong pass');
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('generating token...');
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

module.exports = router;
