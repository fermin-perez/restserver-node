const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoria } = require('../helpers/db-validators');

const {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria,
  obtenerCategoria,
} = require('../controllers/categorias');

const router = Router();

router.get('/', obtenerCategorias);

router.get(
  '/:id',
  [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
