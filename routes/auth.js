const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashed,
            username
        });

        await newUser.save();

        return res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;