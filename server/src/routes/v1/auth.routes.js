const { Router } = require('express');
const authRouter = Router();
const { registerUser, loginUser } = require('../../controllers/auth.controller');

// Ruta para el registro de usuarios
authRouter.post('/register', registerUser);

// Ruta para la autenticación de usuarios
authRouter.post('/login', loginUser);

module.exports = authRouter;