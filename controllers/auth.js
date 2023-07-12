const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generarJWT.JS');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  //Verificar si el email existe
  const usuario = await Usuario.findOne({ correo });
  if (!usuario) {
    return res.status(400).json({
      msg: 'Usuario / Password no son correctos - correo',
    });
  }

  //Verificar si el usuario esta activo
  if (!usuario.estado) {
    return res.status(400).json({
      msg: 'Usuario / Password no son correctos - estado: false',
    });
  }

  //Verificar la contraseña
  const validPassword = bcrypt.compareSync(password, usuario.password);
  if (!validPassword) {
    return res.status(400).json({
      msg: 'Usuario / Password no son correctos - password',
    });
  }

  //Generar el JWT
  const token = await generarJWT(usuario.id);

  try {
    res.status(200).json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al hacer login',
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        rol: 'USER_ROLE',
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Token de Google no se pudo verificar',
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
