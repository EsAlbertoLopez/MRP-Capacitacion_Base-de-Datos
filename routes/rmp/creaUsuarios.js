
/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 15/Abril/2022
* @description Script para registrar profesores.
*/

var md5 = require('blueimp-md5')
var dbMrp = require('../../conexiones/dbMigration').of('mrp')
var f = require('../../funciones')

module.exports = {
    creaProfesor: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Usuario creado",
            data: []
        }

        let nombre = req.body.nombre
        let correo = req.body.correo
        let password = req.body.password

        password = md5(password, 'KEYMRPSUPERSECRETA');  

        let query = `INSERT INTO PROFESORES (NOMBRE_PROFESOR, CORREO, PASSWORD)
                    VALUES ?`


        if(!f.definido(nombre) || !f.definido(correo) || !f.definido(password)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            let inserta = []
            inserta.push([
                nombre,
                correo,
                password
            ])
            dbMrp.query(query, [inserta], async (err, data) => {
                if(err) {
                    console.log(err)
                    response.replyCode = 500;
                    response.replyText = 'Error en la solicitud de datos';
                    response.data = undefined;
                    res.status(500).send(response);
                } else {
                    response.replyCode = 200;
                    response.replyText = 'Usuario creado con exito';
                    response.data = [data.insertId];
                    res.status(200).send(response);
                }
            })
        }
    }, 

    creaAlumno: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Usuario creado",
            data: []
        }

        let nombre = req.body.nombre
        let correo = req.body.correo
        let password = req.body.password

        password = md5(password, 'KEYMRPSUPERSECRETA');  

        let query = `INSERT INTO ALUMNOS (NOMBRE_ALUMNO, CORREO, PASSWORD)
                    VALUES ?`

        if(!f.definido(nombre) || !f.definido(correo) || !f.definido(password)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            let inserta = []
            inserta.push([
                nombre,
                correo,
                password
            ])
            dbMrp.query(query, [inserta], async (err, data) => {
                if(err) {
                    console.log(err)
                    response.replyCode = 500;
                    response.replyText = 'Error en la solicitud de datos';
                    response.data = undefined;
                    res.status(500).send(response);
                } else {
                    response.replyCode = 200;
                    response.replyText = 'Usuario creado con exito';
                    response.data = [data.insertId];
                    res.status(200).send(response);
                }
            })
        }
    }

}