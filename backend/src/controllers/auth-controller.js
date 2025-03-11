import { compare, genSalt, hash } from "bcrypt";
import Admin from "../models/admin-model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ResponseError from "../error/response-error.js";
import fs from "fs";
import s3 from "../util/aws3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Siswa from "../models/siswa-model.js";
import Kelas from "../models/kelas-model.js";
import Guru from "../models/guru-model.js";

dotenv.config();

const maxAge = 24 * 60 * 60 * 1000;

const createToken = (data, id, role) => {
  const secretKey = process.env.JWT_SECRET_KEY || "thisismysecretkey";
  if (!secretKey) {
    throw new Error("CLAVE SECRETA JWT NO ESTÁ DEFINIDA");
  }

  const jwtExpiration = 24 * 60 * 60;

  return jwt.sign({ data, id, role }, secretKey, { expiresIn: jwtExpiration });
};

export const createAdmin = async (req, res, next) => {
  try {
    const username = req.body.ni;
    const password = req.body.password;

    const admin = new Admin({ username, password });

    await admin.save();

    res.status(200).json({ success: true, admin });
  } catch (error) {
    next();
  }
};

export const loginUser = async (req, res, next) => {
  try {
    console.log("[Auth] Iniciando proceso de autenticación...");
    const { ni, password } = req.body;
    console.log(`[Auth] Credenciales recibidas - NI/NIS: ${ni}`);

    let user =
      (await Admin.findOne({ username: ni })) ||
      (await Guru.findOne({ nip: ni })) ||
      (await Siswa.findOne({ nis: ni }));

    if (!user) {
      console.error(`[Auth] Usuario no encontrado - NI/NIS: ${ni}`);
      throw new ResponseError(404, "NIS/NIP o contraseña incorrectos");
    }
    console.log(`[Auth] Usuario encontrado - Rol: ${user.role}, ID: ${user.id}`);

    console.log("[Auth] Verificando contraseña...");
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      console.error(`[Auth] Contraseña incorrecta - Usuario: ${user.id}`);
      throw new ResponseError(400, "NIS/NIP o contraseña incorrectos.");
    }
    console.log("[Auth] Credenciales válidas - Generando token...");

    let data;

    if (user.role === "admin") {
      data = await Admin.findOne({ username: ni }).select("-password");
    } else if (user.role === "guru") {
      data = await Guru.findOne({ nip: ni })
        .select("-password")
        .populate({ path: "waliKelas", select: "kelas nama  " });
    } else if (user.role === "siswa") {
      data = await Siswa.findOne({ nis: ni }).select("-password");
    }

    const accessToken = createToken(ni, user.id, user.role);
    console.log(`[Auth] Token generado - Duración: ${maxAge}ms`);

    res.cookie("Scholarcy", accessToken, {
      maxAge,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    console.log("[Auth] Cookie configurada correctamente");

    res.status(200).json({ success: true, message: "Inicio de sesión exitoso", data });
  } catch (error) {
    console.error("[Auth] Error en proceso de autenticación:", error.message);
    next(error);
  }
};

// export const refreshToken = async (req, res) => {
//   const { Schoolarcy } = req.cookies;

//   if (!Schoolarcy)
//     throw new ResponseError(
//       401,
//       "Sesi Login Telah habis, jika ingin melanjutkan silakan login kembali"
//     );

//   try {
//     const userData = jwt.verify(Schoolarcy, process.env.JWT_SECRET_KEY);
//     const newAccessToken = createToken(userData.data, userData.id);

//     res.status(200).json({
//       success: true,
//       message: "Refresh token Baru",
//       refreshToken: newAccessToken,
//     });
//   } catch (error) {
//   }
// };

export const getAuth = async (req, res, next) => {
  try {
    console.log("[Auth] Solicitud de datos de autenticación");
    const userId = req.userId;
    console.log(`[Auth] Obteniendo datos para usuario ID: ${userId}`);

    let user =
      (await Admin.findOne({ _id: userId }).select("-password")) ||
      (await Guru.findById({ _id: userId })
        .select("-password")
        .populate({ path: "waliKelas", select: "kelas nama" })) ||
      (await Siswa.findById({ _id: userId }).select("-password"));

    if (!user) {
      console.error(`[Auth] Usuario no encontrado - ID: ${userId}`);
      throw new ResponseError(404, "Usuario no encontrado");
    }
    console.log(`[Auth] Datos obtenidos - Rol: ${user.role}`);

    res.status(200).json({
      success: true,
      message: "Datos obtenidos correctamente",
      user,
    });
  } catch (error) {
    console.error("[Auth] Error obteniendo datos:", error.message);
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    console.log("[Auth] Solicitud de subida de imagen recibida");
    if (!req.file) {
      console.error("[Auth] Error: Archivo no proporcionado");
      throw new ResponseError(400, "Se requiere una foto");
    }
    console.log(`[Auth] Procesando archivo: ${req.file.originalname} (${req.file.size} bytes)`);

    const fileStream = fs.createReadStream(req.file.path);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${process.env.AWS_FOLDER}/profiles/${Date.now().toString()}-${req.file.originalname}`,
      Body: fileStream,
      ACL: "public-read",
    };

    const data = await s3.send(new PutObjectCommand(uploadParams));

    const fileName = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    console.log("[Siswa] Ruta del archivo cargado: "+filename);

    let userUpdate;

    if (req.role === "admin") {
      userUpdate = await Admin.findByIdAndUpdate(
        { _id: req.userId },
        { foto: fileName },
        { runValidators: true, new: true }
      );
    }

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("[Auth] Error eliminando archivo temporal:", err.message);
      } else {
        console.log("[Auth] Archivo temporal eliminado correctamente");
      }
    });

    console.log(`[Auth] Imagen subida a S3 - URL: ${fileName}`);
    await res.status(200).json({ 
      success: true,
      message: "Imagen subida exitosamente",
      foto: userUpdate.foto,
    });
  } catch (error) {
    console.error("[Auth] Error en subida de imagen:", error.message);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    console.log("[Auth] Actualización de perfil iniciada");
    const id = req.userId;
    const role = req.role;
    console.log(`[Auth] Actualizando perfil - ID: ${id}, Rol: ${role}`);

    const update = req.body;
    if (update.password && update.password !== "") {
      console.log("[Auth] Actualizando contraseña...");
      const salt = await genSalt();
      update.password = await hash(update.password, salt);
    } else {
      delete update.password;
    }

    let updatedUser;

    if (role === "admin") {
      updatedUser = await Admin.findByIdAndUpdate(
        id,
        { $set: update },
        { runValidators: true, new: true }
      ).select("-password");
    } else if (role === "guru") {
      delete req.body.waliKelas;
      updatedUser = await Guru.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }
      )
        .select("-password")
        .populate("waliKelas");
    } else if (role === "siswa") {
      updatedUser = await Siswa.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }
      ).select("-password");
    }

    console.log(`[Auth] Perfil actualizado correctamente - ID: ${id}`);
    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[Auth] Error actualizando perfil:", error.message);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("Scholarcy", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      success: true,
      message: "Cierre de sesión exitoso",
    });
  } catch (error) {
    next(error);
  }
};

export const getDataUmum = async (req, res, next) => {
  try {
    const tahunMasuk = await Siswa.distinct("tahunMasuk");
    const kelas = await Kelas.find();

    res.status(200).json({
      success: true,
      message: "Datos generales",
      data: { tahunMasuk, kelas },
    });
  } catch (error) {
    next(error);
  }
};
