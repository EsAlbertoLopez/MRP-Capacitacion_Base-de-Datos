/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 15/Abril/2022
* @description Script para hacer el login a las plataformas.
*/

var express = require('express');
var router = express.Router();
var dbMrp = require('../../conexiones/dbMigration').of('mrp')
var f = require('./../../funciones')

module.exports = {
    validaUsuario: async (req, res)  => {
        let pass = req.body.PASSWORD
        let user = req.body.USUARIO

        let response = {
            replyCode: 200,
            replyText: "Usuario validado",
            data: []
        }

        let query = `SELECT PASSWORD
                    FROM PROFESORES
                    WHERE USUARIO = "${user}"`

        if(!f.definido(pass) || !f.definido(user)) {
            response.replyCode = 500;
            response.replyText = 'Ocurrió algo inesperado';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            dbMrp.query(query, (err, data) => {
                if(err) {
                    console.log(err)
                    response.replyCode = 500;
                    response.replyText = 'Ocurrió algo inesperado';
                    response.data = undefined;
                    res.status(500).send(response);
                } else {
                    if(data.length === 0) {
                        response.replyCode = 500;
                        response.replyText = 'Ocurrió algo inesperado';
                        response.data = undefined;
                        res.status(500).send(response);
                    } else {
                        if(data[0].PASSWORD !== pass) {
                            response.replyCode = 500;
                            response.replyText = `Usuario incorrecto`;
                            response.data = [data];
                            res.status(500).send(response);  
                        } else {
                            response.replyCode = 200;
                            response.replyText = `Ok`;
                            response.data = [data];
                            res.status(200).send(response);
                        } 
                    }
                }
            })
        }
    }
}