const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');

const { coleccionesPermitidas } = require('../helpers/db-validators');

const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require('../controllers/uploads');

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

// router.put(
//   '/:coleccion/:id',
//   [
//     validarArchivo,
//     check('id', 'El id debe ser de mongo').isMongoId(),
//     check('coleccion').custom((c) =>
//       coleccionesPermitidas(c, ['usuarios', 'productos'])
//     ),
//     validarCampos,
//   ],
//   actualizarImagen
// );

router.put(
  '/:coleccion/:id',
  [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

router.get(
  '/:coleccion/:id',
  [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
