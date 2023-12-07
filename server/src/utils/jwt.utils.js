const { jwtVerify, SignJWT } = require("jose");

//Crear token
/**
 * 
 * @param {object} payload 
 * @param {string} expirationTime "1d","2h","15m" 
 * @param {string} privateKEY 
 * @returns 
 */
const signToken = async (payload,expirationTime,privateKEY) => {
  const jwtConstructor = new SignJWT(payload);
  const encoder = new TextEncoder();
  const jwt = await jwtConstructor
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encoder.encode(privateKEY)); //Firma de token
  return jwt;
};

//Verificar token
/**
 * 
 * @param {string} token 
 * @param {string} privateKEY 
 * @returns 
 */
const verifyToken = async (token,privateKey) => {
    const encoder = new TextEncoder();
    return jwtVerify(
      token,
      encoder.encode(privateKey)
    );
};

module.exports={
   signToken,
   verifyToken
};