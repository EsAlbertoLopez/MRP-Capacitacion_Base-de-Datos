/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 15/Abril/2022
* @description Script para hacer el login a las plataformas.
*/

var md5 = require('blueimp-md5')
var dbMrp = require('../../conexiones/dbMigration').of('mrp')
var f = require('./../../funciones')

module.exports = {
    validaUsuarioProfesor: async (req, res)  => {
        let pass = req.body.password
        let correo = req.body.correo

        let response = {
            replyCode: 200,
            replyText: "Usuario validado",
            data: []
        }

        pass = md5(pass, 'KEYMRPSUPERSECRETA'); 

        let query = `SELECT PASSWORD, NO_PROFESOR, NOMBRE_PROFESOR
                    FROM PROFESORES
                    WHERE CORREO = "${correo}"`

        if(!f.definido(pass) || !f.definido(correo)) {
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
                            response.data = [];
                            res.status(500).send(response);  
                        } else {
                            response.replyCode = 200;
                            response.replyText = `Ok`;
                            response.data = [data[0].NO_PROFESOR, data[0].NOMBRE_PROFESOR];
                            res.status(200).send(response);
                        } 
                    }
                }
            })
        }
    },

    validaUsuarioAlumno: async (req, res)  => {
        let pass = req.body.password
        let correo = req.body.correo

        let response = {
            replyCode: 200,
            replyText: "Usuario validado",
            data: []
        }

        pass = md5(pass, 'KEYMRPSUPERSECRETA'); 

        let query = `SELECT PASSWORD, NO_ALUMNO, NOMBRE_ALUMNO
                    FROM ALUMNOS
                    WHERE CORREO = "${correo}"`

        if(!f.definido(pass) || !f.definido(correo)) {
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
                            response.data = [];
                            res.status(500).send(response);  
                        } else {
                            response.replyCode = 200;
                            response.replyText = `Ok`;
                            response.data = [data[0].NO_ALUMNO, data[0].NOMBRE_ALUMNO];
                            res.status(200).send(response);
                        } 
                    }
                }
            })
        }
    }
}