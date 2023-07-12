const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos'];

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarProductos = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre');
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');

  res.json({
    results: productos,
  });
};

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const categorias = await Categoria.find({ nombre: regex, estado: true });

  res.json({
    results: categorias,
  });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'productos':
      buscarProductos(termino, res);
      break;
    default:
      return res.status(500).json({ msg: 'Se le olvido hacer esta busqueda' });
  }
};

module.exports = {
  buscar,
};
