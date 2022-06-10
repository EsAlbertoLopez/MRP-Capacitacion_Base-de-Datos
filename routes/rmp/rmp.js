var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload')
router.use(fileUpload({
    limits: {
      fileSize: 1024*1024*50
    },
    abortOnLimit: true
}));

//Constantes de metodos
const { obtieneMaterias } = require('./formulario');
const { validaUsuarioProfesor, validaUsuarioAlumno } = require('./validaUsuario');
const { creaAlumno, creaProfesor } = require('./creaUsuarios');
const { cargaExamen } = require('./cargarExamen');
const { generaToken, validaToken, generaTokenVip, validaTokenVip } = require('./generaToken');
const { regresaExamenes, regresaExamen, regresaExamenesPalabras, regresaExamenesMaestro, borrarExamen } = require('./regresaExamenes');
const { regresaExamenesMuestra } = require('./recuperaExameneMuestra')

//Metodos
router.get('/obtieneMaterias', obtieneMaterias);
router.get('/regresaExamenes/:letra', regresaExamenes);
router.get('/regresaExamen/:idExamen', regresaExamen);
router.get('/regresaExamenPalabra/:palabra', regresaExamenesPalabras);
router.get('/regresaExamenMaestro/:idMaestro', regresaExamenesMaestro);
router.get('recuperaExamenMuestra', regresaExamenesMuestra)
router.post('/validaUsuarioProfesor', validaUsuarioProfesor);
router.post('/borraExamen', borrarExamen);
router.post('/validaUsuarioAlumno', validaUsuarioAlumno);
router.post('/creaProfesor', creaProfesor);
router.post('/creaAlumno', creaAlumno);
router.post('/cargaExamen', cargaExamen);
router.post('/generaToken', generaToken);
router.post('/generaTokenVip', generaTokenVip);
router.post('/validaToken', validaToken);
router.post('/validaTokenVip', validaTokenVip);



module.exports = router;