const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');

const { subirArchivo } = require('../helpers/subir-archivo');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const cargarArchivo = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(
      req.files,
      ['pdf', 'xlsx', 'txt'],
      'textos'
    );
    res.status(200).json({ nombre });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe un usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: 'No existe un producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();

  res.status(200).json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe un usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: 'No existe un producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');

    await cloudinary.uploader.destroy(public_id);
  }

  const { secure_url } = await cloudinary.uploader.upload(
    req.files.archivo.tempFilePath
  );

  modelo.img = secure_url;
  await modelo.save();

  res.status(200).json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: 'No existe un usuario con ese id' });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: 'No existe un producto con ese id' });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      return res.status(200).sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

  res.status(200).sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  actualizarImagenCloudinary,
  mostrarImagen,
};
