const {
  handleErrorResponse,
  handleHttpError,
} = require("../middleware/handle.error.middleware");
const { findUserByEmail } = require("../services/user.service");
const { signToken } = require("../utils/jwt.utils");
const { compare } = require("../utils/password.utils");
const {
  secret_key: { jwt_key },
} = require("../config/constants");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    const passwordMatch = await compare(password, user.password_user);

    if (!passwordMatch) {
      handleErrorResponse(res, "Credenciales incorrectas", 401);
      return;
    }

    const token = await signToken({ user: user.code_user }, "2h", jwt_key);
    
    return res.send({
      user:{
        name: user.name_user,
        email: user.email_user,
        role: user.role_id,
      },
      token:token
    });
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponse(res, "Credenciales incorrectas", 401);
      return;
    }
    handleHttpError(res, error);
  }
}

const endSession = async (req, res) => {

  res.clearCookie("jwt", {
    sameSite: "none",
    secure: true,
  });

  return res.send("Sesión eliminada correctamente");
};

module.exports = {
  loginUser,
  endSession
};
