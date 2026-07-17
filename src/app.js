require('dotenv').config(); // variable de entorno.

const express = require('express');
const conectarDB = require('./config/db');

//rutas.
const plazaRoutes = require('./routes/plazaRoutes');
const grupoRoutes = require('./routes/actividadRoutes');
const actidadRoutes = require('./routes/actividadRoutes');


const http = require('http');
const {Server} = require('socket.io');
const helmet = require('helmet');
const path = require('path');


const mongoose = require("mongoose");


const app = express();


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

// rutas de prueba.
app.get('/api', (req, res) => {
    res.json({mensaje: "Bienvenido a ala APi de adopta una plaza"});
});

//rutas.
app.use('/api/plazas', plazaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/actividades', actidadRoutes);




//configuracion de socket.io (para tiempo real de votaciones).

io.on('connection', (socket) => {
    console.log('Un vecino se conecto a la app');

    // 1 al conectarse , le envio el ranking actual a ese usuario.
    const rankingInicial = [...plazas].sort((a,b) => b.votos - a.votos);
    socket.emit('ranking_actualizado', rankingInicial);

    //2. escuchar cuando el usuario emite un voto con la interfaz.
    socket.on('votar_plaza', (plazaId) => {
        const id = parseInt(plazaId);

        //validacion seguridad 1.
        if(isNaN(id)) {
            return socket.emit('error_votacion', 'El ID de la plaza no es válido.');
        }
        //buscar plaza en listado.
        const plaza = plazas.find(p => p.id === id);

        if (plaza) {
            //incremetar el voto.
            plaza.votos++;
            console.log(`voto registrado para: ${plaza.nombre}. total votos: ${plaza.votos}`);

            // volver a calcular el ranking de mayor a menor.
            const rankingActualizado = [...plazas].sort((a, b) => b.votos - a.votos);

            //emitir en tiempo real a todos( io.emit retransmite a todos los conectados.
            io.emit('ranking_actualizado', rankingActualizado);
        } else {
            socket.emit('error_votacion', 'La plaza seleccionada no existe.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Vecino desconectado');
    });
});

server.listen(PORT,'0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
