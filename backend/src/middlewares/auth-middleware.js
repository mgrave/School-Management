import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  console.log("[Auth] Iniciando verificación de token...");

  console.log("[Auth] Headers:", JSON.stringify(req.headers, null, 2));
  console.log("[Auth] Body:", JSON.stringify(req.body, null, 2));
  console.log("[Auth] Params:", JSON.stringify(req.params, null, 2));
  console.log("[Auth] Query:", JSON.stringify(req.query, null, 2));
  console.log("[Auth] Cookies:", JSON.stringify(req.cookies, null, 2));

  const token = req.cookies.Scholarcy;

  if (!token) {
    console.error("[Auth] Error: No se encontró token en las cookies, pueden ser los cors");
    throw new ResponseError(401, "La sesión de inicio de sesión ha expirado. Si deseas continuar, inicia sesión nuevamente.");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.error(`[Auth] Error de token: ${err.message}`);
      res.clearCookie("jwt");
      throw new ResponseError(401, "Token no válido");
    }

    console.log(`[Auth] Token válido para usuario ID: ${payload.id} Rol: ${payload.role}`);
    req.userId = payload.id;
    req.role = payload.role;

    next();
  });
};

export default verifyToken;
