const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const {
  esRoleValido,
  emailExiste,
  existeUsuario,
} = require('../helpers/db-validators');

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuario),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de 6 caracteres').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  '/:id',
  [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuario),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
