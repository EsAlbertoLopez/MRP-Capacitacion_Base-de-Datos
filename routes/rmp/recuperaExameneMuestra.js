/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 27/Mayo/2022
* @description Script para recuperar los examenes o el examen detalle.
*/

var f = require('./../../funciones')
var mongoose = require('mongoose');
var url = 'mongodb://localhost/MRP';

var examenSchema = new mongoose.Schema({
    examen: {
        id: { type: Number },
        nombreExamen: { type: String },
        descripcion: { type: String },
        idMateria: { type: Number },
        materia: { type: String },
        profe: { type: String },
        idProfe: { type: String },
        dificultad: { type: String },
        cobro: { type: Boolean },
        noPreguntas: { type: String }
    }
})

const modelo = {
    examen: mongoose.model('examenSchema', examenSchema ,'EXAMENES')
}

module.exports = {
    regresaExamenesMuestra: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let idMaestro = req.params.idMaestro.toString()

        if(!f.definido(idMaestro)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            mongoose.connect(url, async function(err, db) {
                let examenesResultado = await modelo.examen.find({"examen.cobro": false}, {"_id": 0, "examen.preguntas": 0}, {limit: 3}).exec()
                response.replyCode = 200;
                response.replyText = 'Examen recuperado con exito';
                response.data = [examenesResultado];
                res.status(200).send(response);
            })
        }
    }
}