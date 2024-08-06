const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const reservationSchema = new mongoose.Schema({
    date: String,
    time: String,
    name: String,
    surname: String
});

const User = mongoose.model('User', userSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);

// Ruta para el inicio de sesión del administrador
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Ruta para realizar reservas
app.post('/reservations', async (req, res) => {
    const { date, time, name, surname } = req.body;
    const reservation = new Reservation({ date, time, name, surname });

    try {
        await reservation.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving reservation:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Ruta para mostrar la página de administración
app.get('/admin-dashboard', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/public/admin.html');
    } else {
        res.redirect('/');
    }
});

// Ruta para obtener las reservas (solo para administradores)
app.get('/reservations', async (req, res) => {
    if (req.session.userId) {
        try {
            const reservations = await Reservation.find();
            res.json(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });


