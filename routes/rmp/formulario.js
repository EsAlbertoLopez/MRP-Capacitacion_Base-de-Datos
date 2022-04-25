/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 15/Abril/2022
* @description Script para obtener las materias.
*/

var express = require('express');
var router = express.Router();
var dbMrp = require('../../conexiones/dbMigration').of('mrp')


module.exports = {
    obtieneMaterias: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Status de reporte actualizado",
            data: []
        }

        let query = `SELECT *
                    FROM MATERIAS`

        dbMrp.query(query, (err, data) => {
            if(err) {
                console.log(err)
                response.replyCode = 500;
                response.replyText = 'Ocurrió algo inesperado';
                response.data = undefined;
                res.status(500).send(response);
            } else {
                response.replyCode = 200;
                response.replyText = `Ok`;
                response.data = [data];
                res.status(200).send(response);   
            }
        })
    },

    cargaExamen: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Status de reporte actualizado",
            data: []
        }
    }
}