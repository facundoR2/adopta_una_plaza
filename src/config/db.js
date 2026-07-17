
const mongoose = require('mongoose');
const verificarYSembrarDatos = require('./seed');

const conectarDB = async () => {
    try {
        //uri del archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("!conexion exitosa a mongoDB local");
        await verificarYSembrarDatos();
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); //la app se detiene si falla conexion.
    }
};
module.exports = conectarDB;