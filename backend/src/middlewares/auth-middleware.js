import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  console.log("[Auth] Iniciando verificación de token...");
  const token = req.cookies.Scholarcy;

  if (!token) {
    console.error("[Auth] Error: No se encontró token en las cookies");
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
