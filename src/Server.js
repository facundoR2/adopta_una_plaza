const app = require('./app');
const conectarDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const Plaza = require('./models/Plaza');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//configuracion de socket.io ( para tiempo real de votaciones).
io.on('connection', async (socket) => {
    console.log('Un vecino se conecto a la app', socket.id);
    try {
        const plazas = await Plaza.find().sort({ votos: -1});
        socket.emit('rankingActualizado', plazas);
    } catch (error) {
        console.error('Error al enviar el ranking por Socket.IO', error);
    }

    socket.on('votarPlaza', async (plazaId) => {
        try {
            await Plaza.findByIdAndUpdate(
                plazaId,
                { $inc: { votos: 1} },
                { new: true}
            );

            const rankingActualizado = await Plaza.find().sort({ votos: -1});
            io.emit('rankingActualizado', rankingActualizado);
        } catch (error) {
            console.error('Error al procesar el voto en tiempo Real: ', error);
        }
    });
});

conectarDB().then(() => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en el puerto: ${PORT}`);
    });
});