
const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        //uri del archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("!conexion exitosa a mongoDB");
    } catch (error) {
        console.error("Eerror al conectar a la base de datos:", error);
        process.exit(1); //la app se detiene si falla conexion.
    }
};
module.exports = conectarDB;