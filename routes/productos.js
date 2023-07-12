const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const {
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
  obtenerProductos,
} = require('../controllers/productos');

const router = Router();

router.get('/', obtenerProductos);

router.get(
  '/:id',
  [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
