import express from "express";
import {
  createAdmin,
  getAuth,
  getDataUmum,
  loginUser,
  logout,
  updateProfile,
  uploadProfileImage,
} from "../controllers/auth-controller.js";
import verifyToken from "../middlewares/auth-middleware.js";
import { upload } from "../util/multer.js";

const authRouter = express.Router();

// Log para registrar solicitudes entrantes
authRouter.use((req, res, next) => {
  console.log(`[Auth-Router] ${new Date().toISOString()} Method: ${req.method} Url: ${req.url}`);
  next();
});

// Ruta para crear un administrador
authRouter.post("/create-admin", (req, res, next) => {
  console.log("📝 [Auth-Router] Creando un nuevo administrador");
  createAdmin(req, res, next);
});

// Ruta para iniciar sesión
authRouter.post("/login", (req, res, next) => {
  console.log("🔑 [Auth-Router] Iniciando sesión");
  loginUser(req, res, next);
});

// Ruta para obtener la autenticación
authRouter.get("/get-auth", verifyToken, (req, res, next) => {
  console.log("🔍 [Auth-Router] Obteniendo autenticación");
  getAuth(req, res, next);
});

// Ruta para actualizar el perfil
authRouter.put("/update-profile", verifyToken, (req, res, next) => {
  console.log("🔄 [Auth-Router] Actualizando perfil");
  updateProfile(req, res, next);
});

// Ruta para cerrar sesión
authRouter.delete("/logout", verifyToken, (req, res, next) => {
  console.log("🚪 [Auth-Router] Cerrando sesión");
  logout(req, res, next);
});

// Ruta para subir una imagen de perfil
authRouter.post(
  "/add-profile-image",
  verifyToken,
  upload.single("image"),
  (req, res, next) => {
    console.log("📸 [Auth-Router] Subiendo imagen de perfil");
    uploadProfileImage(req, res, next);
  }
);

// Ruta para obtener datos generales
authRouter.get("/get-data-umum", verifyToken, (req, res, next) => {
  console.log("📊 [Auth-Router] Obteniendo datos generales");
  getDataUmum(req, res, next);
});

export default authRouter;
