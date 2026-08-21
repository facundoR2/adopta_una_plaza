require('dotenv').config(); // variable de entorno.





// seguridad
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const app = express();
//permitir peticiones desde frontend en vite.

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


//rutas.
const plazaRoutes = require('./routes/plazaRoutes');
const grupoRoutes = require('./routes/actividadRoutes');
const actidadRoutes = require('./routes/actividadRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');

//modelos.
const Plaza = require('./models/Plaza');

const http = require('http');
const {Server} = require('socket.io');
const helmet = require('helmet');
const path = require('path');


const mongoose = require("mongoose");





const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
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

//conexion de mongo DB.
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;
conectarDB();



//permitir qu el servidor exponga los archivos estaticos  de la carpeta public de forma nativa.

app.use(express.static(path.join(__dirname, 'public')));
// permite al servidor usar jwt.
app.use(cookieParser());
// rutas de prueba.
app.get('/api', (req, res) => {
    res.json({mensaje: "Bienvenido a ala APi de adopta una plaza"});
});

//rutas.
app.use('/api/plazas', plazaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/actividades', actidadRoutes);
app.use('/api/auth', usuarioRoutes);
app.use('/api/noticias', noticiaRoutes);





//configuracion de socket.io (para tiempo real de votaciones).

io.on('connection', async (socket) => {
    console.log('Un vecino se conecto a la app', socket.id);
    try {
        //buscar plaza de MongoDB de mayor a menor.
        const plazas = await Plaza.find().sort({ votos: -1});

        //se envia las plazas al front. que se conecta.
        socket.emit('rankingActualizado', plazas);
    }catch (error) {
        console.error('Error al enviar el ranking por Socket.io', error);
    }
    socket.on('votarPlaza', async (plazaId) => {
        try {
            const plazaActualizada = await Plaza.findByIdAndUpdate(
                plazaId,
                {$inc: {votos: 1 }},
                {new: true}
            );

            const rankingActualizado = await Plaza.find().sort({ votos: -1});
            io.emit('rankingActualizado', rankingActualizado);
        }catch (error){
            console.error('Error al procesar el voto en tiempo real:', error);
        }
    });
});





server.listen(PORT,'0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
