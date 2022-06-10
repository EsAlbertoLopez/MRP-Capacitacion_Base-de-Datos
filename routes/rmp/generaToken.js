
/**
* @author Guillermo Adrian Urbina Aguiñiga
* @date 15/Abril/2022
* @description Script para registrar profesores.
*/

var dbMrp = require('../../conexiones/dbMigration').of('mrp')
var f = require('../../funciones')
var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guilleaua@gmail.com',
        pass: 'udjlnbbavqbaquwr'
    }
});

module.exports = {
    generaToken: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let noProfesor = req.body.noProfesor
        let correo = req.body.correo

        let token = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

        let queryToken = `INSERT INTO TOKEN (TOKEN_VALUE)
                    VALUES (${token})`

        if(!f.definido(noProfesor)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            dbMrp.query(queryToken, async (err, data) => {
                if(err) {
                    console.log(err)
                    response.replyCode = 500;
                    response.replyText = 'Error en la solicitud de datos';
                    response.data = undefined;
                    res.status(500).send(response);
                } else {
                    let queryTokenUsuario = `INSERT INTO TOKEN_USUARIOS (ID_TOKEN,ID_PROFESOR)
                                            VALUES (${data.insertId}, ${noProfesor})`
                    dbMrp.query(queryTokenUsuario, async (err, data2) => {
                        if(err) {
                            console.log(err)
                            response.replyCode = 500;
                            response.replyText = 'Error en la solicitud de datos';
                            response.data = undefined;
                            res.status(500).send(response);
                        } else {
                            var mailOptions = {
                                from: 'mrppruebaservidor@gmail.com',
                                to: correo,
                                subject: 'Token de acceso',
                                text: `Hola, tu código de acceso es ${token}`
                            };
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error)
                                    response.replyCode = 500;
                                    response.replyText = 'El correo no pudo ser enviado';
                                    response.data = undefined;
                                    res.status(500).send(response);
                                } else {
                                    response.replyCode = 200;
                                    response.replyText = 'Correo enviado con exito';
                                    response.data = [data];
                                    res.status(200).send(response);
                                }
                            });
                        }
                    })
                }
            })
        }
    }, 

    generaTokenVip: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let idAlumno = req.body.idAlumno.toString()
        let idExamen = req.body.idExamen.toString()
        let token = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

        let queryToken = `SELECT CORREO
                        FROM ALUMNOS
                        WHERE NO_ALUMNO = ${idAlumno}`

        if(!f.definido(idAlumno) | !f.definido(idExamen)) {
            response.replyCode = 500;
            response.replyText = 'Error en la solicitud de datos';
            response.data = undefined;
            res.status(500).send(response);
        } else {
            dbMrp.query(queryToken, async (err, data) => {
                if(err) {
                    console.log(err)
                    response.replyCode = 500;
                    response.replyText = 'Error en la solicitud de datos';
                    response.data = undefined;
                    res.status(500).send(response);
                } else {
                    let queryTokenUsuario = `INSERT INTO TOKEN_EXAMEN (ID_EXAMEN,ID_USUARIO, TOKEN_VALUE)
                                            VALUES (${idExamen}, ${idAlumno}, ${token})`
                    dbMrp.query(queryTokenUsuario, async (err, data2) => {
                        if(err) {
                            console.log(err)
                            response.replyCode = 500;
                            response.replyText = 'Error en la solicitud de datos';
                            response.data = undefined;
                            res.status(500).send(response);
                        } else {
                            var mailOptions = {
                                from: 'mrppruebaservidor@gmail.com',
                                to: data[0].CORREO,
                                subject: 'Token de acceso',
                                text: `Hola, tu código de acceso es ${token}`
                            };
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error)
                                    response.replyCode = 500;
                                    response.replyText = 'El correo no pudo ser enviado';
                                    response.data = undefined;
                                    res.status(500).send(response);
                                } else {
                                    response.replyCode = 200;
                                    response.replyText = 'Correo enviado con exito';
                                    response.data = [data];
                                    res.status(200).send(response);
                                }
                            });
                        }
                    })
                }
            })
        }
    }, 

    validaToken: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let noProfesor = req.body.noProfesor
        let token = req.body.token
        
        let queryToken = `SELECT * 
                        FROM TOKEN_USUARIOS A
                        INNER JOIN TOKEN AS B
                        ON B.TOKEN_VALUE = ${token} AND A.ID_PROFESOR = ${noProfesor}`

        dbMrp.query(queryToken, async (err, data) => {
            if(err) {
                console.log(err)
                response.replyCode = 500;
                response.replyText = 'Error en la solicitud de datos';
                response.data = undefined;
                res.status(500).send(response);
            } else {
                if(data.length > 0) {
                    let queryTokenBorrarUsuario = `DELETE FROM TOKEN_USUARIOS WHERE ID_TOKEN = ${data[0].ID_TOKEN}`
                    let queryTokenBorrarToken = `DELETE FROM TOKEN WHERE ID_TOKEN = ${data[0].ID_TOKEN}`

                    dbMrp.query(queryTokenBorrarUsuario, async (err, data2) => {
                        if (err) {
                            response.replyCode = 500;
                            response.replyText = 'Código incorrecto';
                            response.data = undefined;
                            res.status(500).send(response);
                        } else {
                            dbMrp.query(queryTokenBorrarToken, async (err, data3) => {
                                if(err) {
                                    response.replyCode = 500;
                                    response.replyText = 'Código incorrecto';
                                    response.data = undefined;
                                    res.status(500).send(response);
                                } else {
                                    response.replyCode = 200;
                                    response.replyText = 'Validado con exito';
                                    response.data = [];
                                    res.status(200).send(response);
                                }
                            })
                        }
                    })
                } else {
                    response.replyCode = 500;
                    response.replyText = 'Código incorrecto';
                    response.data = undefined;
                    res.status(500).send(response);
                }
            }
        })
    },

    validaTokenVip: async (req, res) => {
        let response = {
            replyCode: 200,
            replyText: "Token generado",
            data: []
        }

        let idAlumno = req.body.idAlumno
        let idExamen = req.body.idExamen
        let token = req.body.token

        let queryBorrado = `DELETE FROM TOKEN_EXAMEN WHERE TOKEN_VALUE = ${token}`
        let queryValida = `SELECT TOKEN_VALUE 
                            FROM TOKEN_EXAMEN 
                            WHERE ID_EXAMEN = ${idExamen} AND ID_USUARIO = ${idAlumno}`

        dbMrp.query(queryValida, async (err, data) => {
            if(err) {
                console.log(err)
                response.replyCode = 500;
                response.replyText = 'Error en la solicitud de datos';
                response.data = undefined;
                res.status(500).send(response);
            } else {
                if(data[0].TOKEN_VALUE === token) {
                    dbMrp.query(queryBorrado, async (err, data2) => {
                        if (err) {
                            response.replyCode = 500;
                            response.replyText = 'Código incorrecto';
                            response.data = undefined;
                            res.status(500).send(response);
                        } else {
                            response.replyCode = 200;
                            response.replyText = 'Validado con exito';
                            response.data = [];
                            res.status(200).send(response);
                        }
                    })
                } else {
                    response.replyCode = 500;
                    response.replyText = 'Código incorrecto';
                    response.data = undefined;
                    res.status(500).send(response);
                }
            }
        })
    }

}