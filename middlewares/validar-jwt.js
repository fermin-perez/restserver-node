const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    //Verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe DB',
      });
    }

    //Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario inactivo',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

module.exports = {
  validarJWT,
};
