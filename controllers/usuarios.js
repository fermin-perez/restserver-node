const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.status(200).json({
    total,
    usuarios,
  });
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.status(200).json(usuario);
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol,
  });

  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();

  res.status(201).json(usuario);
};

const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.status(200).json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
