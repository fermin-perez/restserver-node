const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol) => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error('El rol no es valido');
  }
};

const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error('El correo ya esta registrado');
  }
};

const existeUsuario = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error('El id no existe');
  }
};

const existeCategoria = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error('El id no existe');
  }
};

const existeProducto = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error('El id no existe');
  }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, las permitidas son: ${colecciones}`
    );
  }

  return true;
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuario,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
};
