const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const authenticateUser = require('./middleWare/authMiddleware');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: "Valentine's Day Celebration" });
});

app.post('/save-link', (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.json({ success: false, message: 'No link provided' });
    }

    const query = 'INSERT INTO links (url) VALUES (?)';
    db.query(query, [link], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Link saved successfully!' });
    });
});

app.get('/login', (req, res) => {
    res.render('login', { title: "Login" });
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0];
        const passwordMatch = () => {
            if (password === user.password) {
                return true;
            }
            return false;
        };
        
        if (!passwordMatch()) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        } 
        // Generate JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        // Set token in HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.redirect('/links');
    });
});

app.get('/links', authenticateUser, (req, res) => {
    const query = 'SELECT * FROM links';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database error' });
        }
        res.render('links', { title: "Links", success: true, links: results });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});