const { getInfoRoleUserByCode } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt.utils");
const { secret_key } = require("../config/constants");
const { handleErrorResponse, handleHttpError } = require("./handle.error.middleware");
const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return handleErrorResponse(
        res,
        "Debe Iniciar Sesión. ¡Ingrese de nuevo!",
        401
      );
    }
    const jwt=req.headers.authorization.split(' ').pop();
    console.log(jwt);
    const { payload } = await verifyToken(jwt, secret_key.jwt_key);
    const userInfoFound = await getInfoRoleUserByCode(payload.user);

    req.iduser = userInfoFound.id_user;
    req.nameUser=userInfoFound.name_user;
    req.emailUser=userInfoFound.email_user;
    req.role = userInfoFound.role_id;
    next();
  } catch (error) {
    console.log(error)
    if (typeof error.code === "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleErrorResponse(res, "Token inválido", 401);
  }
};

const checkRole = (roles) => async (req, res, next) => {
  try {
    const { role = "" } = req;

    if (!roles.includes(role)) {
      handleErrorResponse(res, `No tiene los permisos necesarios.`, 403);
      return;
    }
    next();
  } catch (error) {
    handleHttpError(res, error);
  }
};

const checkSession=async(req,res,next)=>{
  const {jwt=''}=req.cookies;

  if(!jwt){
    next()
    return;
  }

  return handleErrorResponse(res,"Ya existe una sesión activa",409);
}


module.exports = {
  checkAuth,
  checkRole,
  checkSession,
};
