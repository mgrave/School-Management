import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  console.log("[Auth-Middleware] Iniciando verificación de token...");

  console.log("[Auth-Middleware] Headers:", JSON.stringify(req.headers, null, 2));
  console.log("[Auth-Middleware] Body:", JSON.stringify(req.body, null, 2));
  console.log("[Auth-Middleware] Params:", JSON.stringify(req.params, null, 2));
  console.log("[Auth-Middleware] Query:", JSON.stringify(req.query, null, 2));
  console.log("[Auth-Middleware] Cookies:", JSON.stringify(req.cookies, null, 2));

  const token = req.cookies[process.env.COOKIE];

  if (!token) {
    console.error("[Auth-Middleware] Error: No se encontró token en las cookies");
    throw new ResponseError(401, "La sesión de inicio de sesión ha expirado.");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.error(`[Auth-Middleware] Error de token: ${err.message}`);
      res.clearCookie([process.env.COOKIE]);
      throw new ResponseError(401, "Token no válido");
    }

    console.log(`[Auth-Middleware] Token válido para usuario ID: ${payload.id} Rol: ${payload.role}`);
    req.userId = payload.id;
    req.role = payload.role;
    next();
  });
};

export default verifyToken;
