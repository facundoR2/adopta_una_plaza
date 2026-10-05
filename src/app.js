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

//permitir peticiones desde el front con vite. tanto de ahi como de localhost.
//porque la ip puede cambiar por el router  DHCP

const origenPermitido = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}):5173$/;

app.use(cors({
    origin: (origin, callback) => {
        // Sin "origin" (ej. Postman, curl, o server-to-server) se lo deja pasar.
        if (!origin) return callback(null, true);
        if (origenPermitido.test(origin)) return callback(null, true);
        callback(new Error('Origen no permitido por CORS: ' + origin));
    },
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
const avanceRoutes = require('./routes/AvanceRoutes');


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
app.use('/api/avances', avanceRoutes);


module.exports = app;