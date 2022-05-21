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
const { validaUsuario } = require('./validaUsuario');
const { creaAlumno, creaProfesor } = require('./creaUsuarios');
const { cargaExamen } = require('./cargarExamen');
const { generaToken, validaToken } = require('./generaToken')

//Metodos
router.get('/obtieneMaterias', obtieneMaterias);
router.post('/validaUsuario', validaUsuario);
router.post('/creaProfesor', creaProfesor);
router.post('/creaAlumno', creaAlumno);
router.post('/cargaExamen', cargaExamen);
router.post('/generaToken', generaToken);
router.post('/validaToken', validaToken);



module.exports = router;