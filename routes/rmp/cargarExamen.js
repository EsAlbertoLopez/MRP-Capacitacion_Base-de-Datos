
/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 25/Abril/2022
* @description Script para cargar examenes.
*/

var xlsx = require("xlsx");
var express = require('express');
var fs = require('fs')
var router = express.Router();
var dbMrp = require('../../conexiones/dbMigration').of('mrp');
var f = require('../../funciones');

var mongoose = require('mongoose');
var url = 'mongodb://localhost/MRPDB';

var examenSchema = new mongoose.Schema({
    id: { type: Number },
    nombreExamen: { type: String },
    materia: { type: String },
    profe: { type: String },
    dificultad: { type: String },
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

function ExcelAJSON(formatoExamen) {
    let fecha = Date.now();
    fs.writeFileSync(`./files/Examen${fecha}.xlsx`, formatoExamen.data)
    return new Promise((resolve) => {
        const excel = xlsx.readFile(`./files/Examen${fecha}.xlsx`);
        fs.unlinkSync(`./files/Examen${fecha}.xlsx`)
        var nombreHoja = excel.SheetNames; // regresa un array
        let datos = xlsx.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
    
        const jDatos = [];
        for (let i = 0; i < datos.length; i++) {
          const dato = datos[i];
          jDatos.push({
            ...dato,
          });
        }
        resolve(jDatos)
    })
}

module.exports = {
    cargaExamen: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Examen cargado",
            data: []
        }

        let nombreExamen = req.body.nombreExamen
        let materia = req.body.idMateria
        let profe = req.body.profe
        let dificultad = req.body.dificultad
        let formatoExamen = req.files.formatoExamen
        let preguntas = await ExcelAJSON(formatoExamen);

        if(!f.definido(nombreExamen) || !f.definido(materia) || !f.definido(profe) || !f.definido(formatoExamen) || !f.definido(preguntas) || !f.definido(dificultad)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            let examen = {
                id: parseInt(Date.now()).toString(),
                nombreExamen: nombreExamen,
                materia: materia,
                profe: profe,
                preguntas: preguntas
            }

            mongoose.connect(url, function(err, db) {
                db.collection('EXAMENES').insertOne({examen});
            })

            response.replyCode = 200;
            response.replyText = 'Examen creado con exito';
            response.data = [examen];
            res.status(200).send(response);
        }
        
    },

    borrarExamen: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Examen borrado",
            data: []
        }
    }
} 