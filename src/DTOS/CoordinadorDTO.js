class CoordinadorDTO {
    /**
     * @param {Object} usuario // Documento de usuario de MONGODB.
     * @param {Array} adopciones //lista de documentos de coleccion de adopciones.
     */
    constructor(usuario, adopciones = []) {
        this.id = usuario._id;
        this.nombre = usuario.nombre;
        this.email = usuario.email;
        //mapeo de plazas para buscar lo iDS.
        this.plazas = adopciones.map(adopcion =>
            typeof adopcion.plaza === 'object' && adopcion.plaza !== null
            ? adopcion.plaza._id : adopcion.plaza
        );
    }
}
module.exports = CoordinadorDTO;