/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 27/Mayo/2022
* @description Script para recuperar los examenes o el examen detalle.
*/

var f = require('./../../funciones')
var mongoose = require('mongoose');
var url = 'mongodb://localhost/MRP';

var examenSchema = new mongoose.Schema({
    id: { type: Number },
    nombreExamen: { type: String },
    idMateria: { type: Number },
    materia: { type: String },
    profe: { type: String },
    dificultad: { type: String },
    cobro: { type: Boolean },
    preguntas: [{
        pregunta: [{
            indice: { type: String },
            texto: { type: String },
            a: { type: String },
            b: { type: String },
            c: { type: String },
            d: { type: String },
            e: { type: String },
            f: { type: String },
            respuesta: { type: String }, 
            retroalimentacion: { type: String }
        }]
    }]
})

const modelo = {
    examen: mongoose.model('examenSchema', examenSchema ,'EXAMENES')
}

module.exports = {
    regresaExamenes: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let letra = req.params.letra

        if(!f.definido(letra)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            mongoose.connect(url, function(err, db) {
                let examenesResultado = await examen.find({"examen.materia": /(\b[Rr])/}).exec()
                console.log(examenesResultado)
            })
        }
    },

    regresaExamen: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let idExamen = req.params.idExamen.toString()

        if(!f.definido(idExamen)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            mongoose.connect(url, function(err, db) {
                db.collection("EXAMENES").findOne({"examen.id": idExamen}, function(err, result) {
                    if(err) {
                        db.close();
                        response.replyCode = 500;
                        response.replyText = 'Error en la solicitud de datos';
                        response.data = undefined;
                        res.status(500).send(response);
                    } else {
                        db.close();
                        response.replyCode = 200;
                        response.replyText = 'Examen recuperado con exito';
                        response.data = [result];
                        res.status(200).send(response);
                    }
                });
            })
        }
    }
}