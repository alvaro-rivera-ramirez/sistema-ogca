const Users = require('../models/Users');
const { handleErrorResponse, handleHttpError } = require('../middleware/handle.error.middleware');
const sequelize = require('../config/database');
const { signToken, verifyToken } = require('../utils/jwt.utils');
const { encrypt, compare } = require('../utils/password.utils'); 
const { secret_key } = require("../config/constants");

async function registerUser(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { email_user, name_user, lastname_user, dni_user, phone_user, password_user, code_user } = req.body;

    // Verifica si el usuario ya existe por su email.
    const existingUser = await Users.findOne({ where: { email_user } });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Genera un hash de la contraseña antes de almacenarla.
    const hashedPassword = await encrypt(password_user); // Utiliza la función encrypt en lugar de hashPassword

    // Crea un nuevo usuario en la base de datos.
    await Users.create({ email_user, name_user, lastname_user, dni_user, phone_user, password_user: hashedPassword, code_user }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    await transaction.rollback();
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
}

async function loginUser(req, res) {
  try {
    const { email_user, password_user } = req.body;

    // Busca al usuario por su dirección de correo electrónico.
    const user = await Users.findOne({ where: { email_user } });

    // Si el usuario no existe, devuelve un mensaje de error.
    if (!user) {
      console.error('Usuario no encontrado'); // Registro de error
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Compara la contraseña proporcionada con el hash almacenado.
    const passwordMatch = await compare(password_user, user.password_user); // Utiliza tu función comparePassword

    // Si las contraseñas no coinciden, devuelve un mensaje de error.
    if (!passwordMatch) {
      console.error('Contraseña incorrecta'); // Registro de error
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = signToken({ email:email_user }, '2h', 'tu_secreto_secreto');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error en loginUser:', error); // Registro de error
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

function verifingToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  try {
    // Aquí debes utilizar la clave pública en lugar de la clave privada para verificar el token.
    const publicKey = 'tu_clave_publica'; // Reemplaza 'tu_clave_publica' con la clave pública correcta.

    // Verifica el token JWT utilizando la clave pública.
    const payload = jwtVerify(token, publicKey);

    req.user = payload;
    next(); // Continúa con la solicitud si el token es válido.
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifingToken
};
