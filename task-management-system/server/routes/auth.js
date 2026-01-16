const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, authenticateToken } = require('../middleware/authMiddleware');

// Register
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashedPassword],
        function (err) {
            if (err) return res.status(500).send("Error registering user: " + err.message);

            const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '24h' });
            res.status(200).send({ auth: true, token, user: { id: this.lastID, username, email } });
        });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
        res.status(200).send({ auth: true, token, user: { id: user.id, username: user.username, email: user.email } });
    });
});

// Get All Users (Protected, for assignment)
router.get('/users', authenticateToken, (req, res) => {
    db.all(`SELECT id, username, email FROM users`, [], (err, rows) => {
        if (err) return res.status(500).send("Error fetching users");
        res.status(200).json(rows);
    });
});

module.exports = router;
