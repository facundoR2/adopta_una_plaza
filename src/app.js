require('dotenv').config(); // variable de entorno.

// seguridad
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
//const conectarDB = require('./config/db');
const app = express();
//permitir peticiones desde frontend en vite.

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// middleware seguridad y configuracion ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "/socket.io/socket.io.js", "/main.js"],
            connectSrc: ["'self'", "ws://localhost:3000", "http://localhost:3000"]
        }
    }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('src/public'));
app.use(cookieParser());

//rutas.
const plazaRoutes = require('./routes/plazaRoutes');
const grupoRoutes = require('./routes/actividadRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const authRoutes = require('./routes/authRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
//modelos usado para votacion en tiempo real.
const Plaza = require('./models/Plaza');


// rutas de prueba.
app.get('/api', (req, res) => {
    res.json({mensaje: "Bienvenido a ala APi de adopta una plaza"});
});

//rutas.
app.use('/api/plazas', plazaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/usuarios', usuarioRoutes);


module.exports = app;