const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    try{
        //extraer el token de la cooki que envia automaticamente el navegador.
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(403).json({ mensaje: 'Acceso denegado. Inicie sesión'});
        }

        //verificar la firma del JWT.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //si el usuario es valido y es coordinador, dejamos que pase a la proxima accion.
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token invalido o expirado'});
    }
};
const verificarRol = (rolEsperado) => (req, res, next) =>{
    try {
        //extraer el token de la cooki que envia automaticamente el navegador.
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(403).json({mensaje: 'Acceso denegado. Inicie sesión'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.rol !== rolEsperado) {
            return res.status(403).json({ mensaje: 'Acceso denegado. Credenciales invalidas'});
        }
        req.usuario = decoded;
        next();


    } catch (error) {
        return res.status(403).json({ mensaje: 'Token invalido o expirado'});
    }

}

module.exports = { verificarToken, verificarRol };