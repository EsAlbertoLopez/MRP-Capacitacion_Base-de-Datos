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

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

module.exports = {
    regresaExamenes: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let letra = req.params.letra.toString()
        let re = new RegExp(`^${letra}`);

        if(!f.definido(letra)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            mongoose.connect(url, async function(err, db) {
                let examenesResultado = await modelo.examen.find({"examen.materia":{$regex: re}}, {"_id": 0, "examen.preguntas": 0}).exec()
                response.replyCode = 200;
                response.replyText = 'Examen recuperado con exito';
                response.data = [examenesResultado];
                res.status(200).send(response);
            })
        }
    },

    regresaExamenesPalabras: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let palabra = req.params.palabra.toString()
        let palabraMayuscula = palabra.toUpperCase()
        let palabraMinuscula = palabra.toLowerCase()
        let palabraPrimeraLetra = capitalize(palabra)
        let re = new RegExp(`/${palabraMayuscula}|${palabraMinuscula}|${palabraPrimeraLetra}/`);

        if(!f.definido(palabra)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            mongoose.connect(url, async function(err, db) {
                let examenesResultado = await modelo.examen.find({"examen.nombreExamen":{$regex: re}}, {"_id": 0, "examen.preguntas": 0}).exec()
                response.replyCode = 200;
                response.replyText = 'Examen recuperado con exito';
                response.data = [examenesResultado];
                res.status(200).send(response);
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