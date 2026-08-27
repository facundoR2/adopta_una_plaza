const Plaza = require('../models/Plaza');

const buscarPlaza = async (req, res) => {
    try{
        const plaza = await Plaza.findOne({ uId: req.params.id});
        if(!plaza) {
            return res.status(404).json({ mensaje:  'Plaza no encontrada'});
        }
        res.json(plaza);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al buscar la Plaza'});
    }
}

module.exports = {buscarPlaza};