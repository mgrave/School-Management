import ResponseError from "../error/response-error.js";
import Siswa from "../models/siswa-model.js";
import Kelas from "../models/kelas-model.js";
import fs from "fs";
import s3 from "../util/aws3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { genSalt, hash } from "bcrypt";

export const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const { tahunMasuk, jenisKelamin, kelas, kelasNama } = req.query;

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery = {
      $or: [
        { nama: { $regex: searchRegex } },
        { nis: { $regex: searchRegex } },
      ],
    };

    if (tahunMasuk) {
      filterQuery.tahunMasuk = tahunMasuk;
    }

    if (jenisKelamin) {
      filterQuery.jenisKelamin = jenisKelamin;
    }

    if (kelasNama) {
      filterQuery.kelas = kelasNama;
    }

    let siswa = await Siswa.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("kelas")
      .exec();

    // if (kelasNama) {
    //   siswa = siswa.filter((s) => s.kelas && s.kelas.nama === kelasNama);
    // }

    const totalSiswa = await Siswa.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data siswa",
      data: siswa,
      pagination: {
        currentPage: page,
        perPage: limit,
        total: totalSiswa,
        totalPages: Math.ceil(totalSiswa / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhotoSiswa = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ResponseError(400, "Foto di butuhkan");
    }

    const fileStream = fs.createReadStream(req.file.path);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `Siswa/${Date.now().toString()}-${req.file.originalname}`,
      Body: fileStream,
      ACL: "public-read",
    };

    const data = await s3.send(new PutObjectCommand(uploadParams));

    const fileName = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    await res.status(200).json({
      success: true,
      message: "Berhasil unggah gambar",
      foto: fileName,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addSiswa = async (req, res, next) => {
  try {
    const { kelas, namaKelas, nis, password } = req.body;

    const siswaExist = await Siswa.findOne({ nis });

    if (siswaExist) {
      throw new ResponseError(404, "NIS sudah digunakan");
    }

    const salt = await genSalt();

    const hashedPassword = await hash(password, salt);

    let newSiswa;

    if (!kelas && !namaKelas) {
      delete req.body.kelas;
      delete req.body.namaKelas;

      newSiswa = new Siswa({
        password: hashedPassword,
        ...req.body,
      });
      await newSiswa.save();
    } else {
      const kelasSiswa = await Kelas.findOne({
        kelas,
        nama: namaKelas,
      });

      if (!kelasSiswa) {
        throw new ResponseError(404, "Kelas tidak ditemukan.");
      }

      newSiswa = new Siswa({
        password: hashedPassword,
        ...req.body,
        kelas: kelasSiswa._id,
      });

      const siswaSaved = await newSiswa.save();
      kelasSiswa.siswa.push(siswaSaved._id);
      kelasSiswa.jumlahSiswa = kelasSiswa.siswa.length;

      await kelasSiswa.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Berhasil menambahkan siswa" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteOneSiswa = async (req, res, next) => {
  try {
    const id = req.params.id;

    const siswa = await Siswa.findById(id);

    console.log(siswa);

    if (!siswa) {
      throw new ResponseError(404, "Siswa tidak ditemukan.");
    }

    const kelas = await Kelas.findById(siswa.kelas);

    if (siswa.kelas) {
      const updateKelas = kelas.siswa.filter((data) => data.toString() !== id);
      const jumlahSiswa = updateKelas.length;

      await Kelas.findByIdAndUpdate(kelas._id, {
        siswa: updateKelas,
        jumlahSiswa,
      });
    }

    await Siswa.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: `Berhasil menghapus siswa`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteManySiswa = async (req, res, next) => {
  try {
    const { dataChecked } = req.body;

    const SiswaList = await Siswa.find({ _id: { $in: dataChecked } });

    await Siswa.deleteMany({ _id: { $in: dataChecked } });

    for (const siswa of SiswaList) {
      const updatedKelas = await Kelas.findByIdAndUpdate(
        siswa.kelas,
        {
          $pull: { siswa: siswa._id },
        },
        { new: true }
      );

      if (updatedKelas) {
        const jumlahSiswa = updatedKelas.siswa.length;

        await Kelas.findByIdAndUpdate(siswa.kelas, {
          jumlahSiswa: jumlahSiswa,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Berhasil menghapus siswa terpilih`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllDetail = async (req, res, next) => {
  try {
    const jumlahSiswa = await Siswa.countDocuments();
    const lk = await Siswa.find({ jenisKelamin: "Laki-Laki" });
    const pr = await Siswa.find({ jenisKelamin: "Perempuan" });

    res.status(200).json({
      success: true,
      message: `Berhasil mengambil detail data`,
      data: { jumlahSiswa, pr, lk },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
