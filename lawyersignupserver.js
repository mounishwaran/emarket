const express = require('express');
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const path = require('path'); // Add this to use path for static files

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'lawyer_portal' 
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route to handle sign up
app.post('/signup', [
    check('full_name').not().isEmpty().withMessage('Full Name is required'),
    check('email').isEmail().withMessage('Enter a valid email').custom(value => {
        return new Promise((resolve, reject) => {
            db.query('SELECT email FROM lawyers WHERE email = ?', [value], (err, results) => {
                if (results.length) {
                    return reject('Email already in use');
                }
                resolve(true);
            });
        });
    }),
    check('license_number').not().isEmpty().withMessage('License Number is required'),
    check('practice_area').not().isEmpty().withMessage('Practice Area is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, license_number, practice_area, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const query = 'INSERT INTO lawyers (full_name, email, license_number, practice_area, password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [full_name, email, license_number, practice_area, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Lawyer registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Test route (optional)
app.get('/test', (req, res) => {
    res.send('This is a test route');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});