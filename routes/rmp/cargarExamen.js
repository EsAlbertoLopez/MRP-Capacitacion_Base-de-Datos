
/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 25/Abril/2022
* @description Script para cargar examenes.
*/

var xlsx = require("xlsx");
var fs = require('fs')
var f = require('../../funciones');

var mongoose = require('mongoose');
var url = 'mongodb://localhost/MRP';

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

let diccionarioOpciones = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5
}

module.exports = {
    cargaExamen: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Examen cargado",
            data: []
        }

        let nombreExamen = req.body.nombreExamen
        let descripcion = req.body.descripcion
        let idMateria = req.body.idMateria
        let materia = req.body.materia
        let profe = req.body.profe
        let dificultad = req.body.dificultad
        let cobro = req.body.cobro === "" ? false : req.body.cobro
        let formatoExamen = req.files.formatoExamen
        let preguntas = await ExcelAJSON(formatoExamen);
        preguntas = preguntas.map(p => ({
            NUMERO: p.NUMERO,
            PREGUNTA: p.PREGUNTA,
            OPCIONES: [
                p.A,
                p.B,
                p.C,
                p.D,
                p.E,
                p.F
            ],
            RESPUESTALETRA: p.RESPUESTA,
            RESPUESTAINDICE: diccionarioOpciones[p.RESPUESTA],
            RETRO: p.RETRO
        }))

        for (var i = 0; i < preguntas.length; i++) {
            preguntas[i].OPCIONES = preguntas[i].OPCIONES.filter(el => el != null)
        } 

        if(!f.definido(nombreExamen) || !f.definido(materia) || !f.definido(idMateria) || !f.definido(profe) || !f.definido(formatoExamen) || !f.definido(preguntas) || !f.definido(dificultad) || !f.definido(cobro) || !f.definido(descripcion)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            let examen = {
                id: parseInt(Date.now()).toString(),
                nombreExamen: nombreExamen,
                description: descripcion,
                idMateria: idMateria,
                materia: materia,
                profe: profe,
                cobro: cobro,
                dificultad: dificultad,
                noPreguntas: preguntas.length,
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