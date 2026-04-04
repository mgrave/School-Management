import mongoose from "mongoose";
import ResponseError from "../error/response-error.js";
import Jadwal from "../models/jadwal-model.js";
import Libur from "../models/libur-model.js";
import Master from "../models/master-model.js";
import Mapel from "../models/mapel-model.js";
import Kelas from "../models/kelas-model.js";
import TahunAjaran from "../models/tahunAjaran-model.js";

const waktuKeTanggal = (waktu) => {
  const [jam, menit] = waktu.split(":").map(Number);
  const tanggal = new Date();
  tanggal.setHours(jam);
  tanggal.setMinutes(menit);
  tanggal.setSeconds(0);
  tanggal.setMilliseconds(0);
  const startOfDay = new Date(
    tanggal.getFullYear(),
    tanggal.getMonth(),
    tanggal.getDate()
  );
  return tanggal.getTime() - startOfDay.getTime();
};

export const addJadwal = async (req, res, next) => {
  try {
    const { bidangStudi, guru, kelas, hari, mulai, selesai, jumlahPertemuan } =
      req.body;

    const master = await Master.findOne();

    const start = waktuKeTanggal(mulai);
    const end = waktuKeTanggal(selesai);

    const miliDetik = end - start;

    const selisihDetik = Math.floor(miliDetik / (1000 * 60));

    if (mulai < master.startTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede ser antes del horario de entrada escolar."
      );
    }

    if (mulai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede ser después del horario de salida escolar."
      );
    }

    if (selesai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser después del horario de salida escolar."
      );
    }

    if (selesai <= master.startTime) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser antes o igual a la hora de inicio."
      );
    }

    if (mulai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede exceder la hora de finalización."
      );
    }

    if (selesai <= mulai) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser anterior a la hora de inicio."
      );
    }

    if (mulai >= selesai) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede exceder la hora de finalización."
      );
    }

    const jadwalKelas = await Jadwal.findOne({
      kelas,
      hari,
      $or: [
        { mulai: { $lt: selesai, $gt: mulai } },
        { selesai: { $lt: selesai, $gt: mulai } },
        { mulai: { $lte: mulai }, selesai: { $gte: selesai } },
      ],
    });

    if (jadwalKelas) {
      throw new ResponseError(
        400,
        "Esta clase ya tiene un horario en ese período."
      );
    }

    const jadwalGuru = await Jadwal.findOne({
      guru,
      hari,
      $or: [
        { mulai: { $lt: selesai, $gt: mulai } },
        { selesai: { $lt: selesai, $gt: mulai } },
        { mulai: { $lte: mulai }, selesai: { $gte: selesai } },
      ],
    });

    if (jadwalGuru) {
      throw new ResponseError(
        400,
        "Este profesor ya tiene una clase programada en ese horario."
      );
    }

    if (jumlahPertemuan <= 0) {
      throw new ResponseError(400, "El número de sesiones debe ser mayor a 0.");
    }

    const libur = await Libur.findOne();

    const weekendHoliday = libur.perpekan.find((p) => p.hari === hari);

    if (weekendHoliday && weekendHoliday.status) {
      throw new ResponseError(
        400,
        "El día seleccionado está configurado como día de descanso semanal."
      );
    }

    if (selisihDetik <= 40) {
      throw new ResponseError(
        400,
        "La duración de la clase no puede ser menor a 40 minutos."
      );
    }

    const pertemuan = await Jadwal.find({
      kelas: new mongoose.Types.ObjectId(kelas),
      guru: new mongoose.Types.ObjectId(guru),
      bidangStudi: new mongoose.Types.ObjectId(bidangStudi),
    });

    if (pertemuan && pertemuan.some((schedule) => schedule.jumlahPertemuan)) {
      const totalPertemuan = pertemuan.reduce((acc, schedule) => {
        return acc + schedule.jumlahPertemuan;
      }, 0);

      const mapel = await Mapel.findById(bidangStudi);

      if (totalPertemuan >= 50) {
        throw new ResponseError(
          400,
          `Las sesiones de ${mapel.nama.toLowerCase()} en esta clase han excedido 50 sesiones`
        );
      }

      if (totalPertemuan + parseInt(jumlahPertemuan) > 50) {
        throw new ResponseError(
          400,
          `Sesiones restantes de ${mapel.nama.toLowerCase()} en esta clase: ${
            50 - totalPertemuan
          }`
        );
      }
    }

    const jadwal = new Jadwal({
      bidangStudi,
      guru,
      kelas,
      hari,
      mulai,
      selesai,
      jumlahPertemuan,
    });

    await jadwal.save();

    res.status(201).json({
      success: true,
      message: "Horario agregado exitosamente",
      jadwal,
    });
  } catch (error) {
    next(error);
  }
};

export const getJadwal = async (req, res, next) => {
  try {
    const jadwal = await Jadwal.find()
      .populate({
        path: "bidangStudi",
      })
      .populate({
        path: "guru",
        select: "nama",
      })
      .populate({
        path: "kelas",
        select: "nama kelas",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Horarios obtenidos con éxito",
      jadwal,
    });
  } catch (error) {
    next(error);
  }
};

export const getJadwalMengajar = async (req, res, next) => {
  try {
    const id = req.userId;

    const jadwal = await Jadwal.find({ guru: id })
      .populate({
        path: "bidangStudi",
      })
      .populate({
        path: "guru",
        select: "nama",
      })
      .populate({
        path: "kelas",
        select: "nama kelas",
      });

    res.status(200).json({
      success: true,
      message: "Horario docente obtenido con éxito",
      jadwal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Jadwal.findByIdAndDelete(id, { new: true });

    res
      .status(200)
      .json({ success: true, message: "Horario eliminado exitosamente." });
  } catch (error) {
    next(error);
  }
};

export const deleteManyJadwal = async (req, res, next) => {
  try {
    const { dataChecked } = req.body;

    await Jadwal.deleteMany({ _id: { $in: dataChecked } });

    res
      .status(200)
      .json({ success: true, message: "Horarios seleccionados eliminados." });
  } catch (error) {
    next(error);
  }
};

export const editJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bidangStudi, guru, kelas, hari, mulai, selesai, jumlahPertemuan } =
      req.body;

    const master = await Master.findOne();

    const start = waktuKeTanggal(mulai);
    const end = waktuKeTanggal(selesai);

    const miliDetik = end - start;

    const selisihDetik = Math.floor(miliDetik / (1000 * 60));

    if (selisihDetik < 40) {
      throw new ResponseError(
        400,
        "La duración de la clase debe ser de al menos 40 minutos."
      );
    }

    if (mulai < master.startTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede ser antes del horario de entrada escolar."
      );
    }

    if (mulai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede ser después del horario de salida escolar."
      );
    }

    if (selesai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser después del horario de salida escolar."
      );
    }

    if (selesai <= master.startTime) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser antes o igual a la hora de inicio."
      );
    }

    if (selesai <= mulai) {
      throw new ResponseError(
        400,
        "La hora de finalización no puede ser anterior a la hora de inicio."
      );
    }

    if (mulai >= selesai) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede exceder la hora de finalización."
      );
    }

    if (mulai > master.endTime) {
      throw new ResponseError(
        400,
        "La hora de inicio no puede exceder la hora de finalización."
      );
    }

    const jadwalKelas = await Jadwal.findOne({
      kelas,
      hari,
      _id: { $ne: id },
      $or: [
        { mulai: { $lt: selesai, $gt: mulai } },
        { selesai: { $lt: selesai, $gt: mulai } },
        { mulai: { $lte: mulai }, selesai: { $gte: selesai } },
      ],
    });

    if (jadwalKelas) {
      throw new ResponseError(
        400,
        "Esta clase ya tiene un horario en ese período."
      );
    }

    const jadwalGuru = await Jadwal.findOne({
      guru,
      hari,
      _id: { $ne: id },
      $or: [
        { mulai: { $lt: selesai, $gt: mulai } },
        { selesai: { $lt: selesai, $gt: mulai } },
        { mulai: { $lte: mulai }, selesai: { $gte: selesai } },
      ],
    });

    if (jadwalGuru) {
      throw new ResponseError(
        400,
        "Este profesor ya tiene una clase programada en ese horario."
      );
    }

    if (jumlahPertemuan <= 0) {
      throw new ResponseError(400, "El número de sesiones debe ser mayor a 0.");
    }

    const libur = await Libur.findOne();

    const weekendHoliday = libur.perpekan.find((p) => p.hari === hari);

    if (weekendHoliday && weekendHoliday.status) {
      throw new ResponseError(
        400,
        "El día seleccionado está configurado como día de descanso semanal."
      );
    }
    const updateData = await Jadwal.findById(id);

    const pertemuan = await Jadwal.find({
      kelas: new mongoose.Types.ObjectId(kelas),
      guru: new mongoose.Types.ObjectId(guru),
      bidangStudi: new mongoose.Types.ObjectId(bidangStudi),
    });

    const totalPertemuan = pertemuan.reduce((acc, schedule) => {
      return acc + schedule.jumlahPertemuan;
    }, 0);

    const mapel = await Mapel.findById(bidangStudi);

    if (updateData.bidangStudi.toString() === bidangStudi) {
      if (
        totalPertemuan +
          parseInt(jumlahPertemuan) -
          updateData.jumlahPertemuan >
        50
      ) {
        throw new ResponseError(
          400,
          `Las sesiones de ${mapel.nama.toLowerCase()} en esta clase han excedido 50 sesiones`
        );
      }
    } else {
      if (totalPertemuan + parseInt(jumlahPertemuan) > 50) {
        throw new ResponseError(
          400,
          `Las sesiones de ${mapel.nama.toLowerCase()} en esta clase han excedido 50 sesiones`
        );
      }
    }

    await Jadwal.findByIdAndUpdate(
      id,
      { bidangStudi, guru, kelas, hari, mulai, selesai, jumlahPertemuan },
      { new: true, runValidators: true, upsert: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Horario actualizado correctamente." });
  } catch (error) {
    next(error);
  }
};

export const getJadwalGuru = async (req, res, next) => {
  try {
    const id = req.userId;

    const jadwal = await Jadwal.find({ guru: id })
      .populate({
        path: "bidangStudi",
      })
      .populate({
        path: "kelas",
        select: "nama kelas",
      });

    const schedules = jadwal.map((item) => {
      return {
        ...item.toObject(),
        class: `${item.kelas.kelas} ${item.kelas.nama}`,
      };
    });

    let durasiSekolah = await Master.findOne();

    if (!durasiSekolah) {
      throw new ResponseError(404, "Duración escolar no encontrada en configuración");
    }

    const mulai = waktuKeTanggal(durasiSekolah.startTime);
    const selesai = waktuKeTanggal(durasiSekolah.endTime);

    const selisihMiliDetik = selesai - mulai;

    const lamaSekolah = Math.floor(selisihMiliDetik / (1000 * 60));
    const mulaiSekolah = Math.floor(
      waktuKeTanggal(durasiSekolah.startTime) / (1000 * 60)
    );

    res.status(200).json({
      success: true,
      message: "Horario docente obtenido",
      schedules,
      durasi: { lama: lamaSekolah, mulai: mulaiSekolah },
    });
  } catch (error) {
    next(error);
  }
};

export const getPertemuan = async (req, res, next) => {
  try {
    const id = req.userId;
    const { bidangStudi, kelas } = req.query;

    const jadwal = await Jadwal.find({
      bidangStudi: new mongoose.Types.ObjectId(bidangStudi),
      kelas: new mongoose.Types.ObjectId(kelas),
      guru: id,
    });

    if (jadwal && jadwal.some((schedule) => schedule.jumlahPertemuan)) {
      const pertemuan = jadwal.reduce((acc, schedule) => {
        return acc + schedule.jumlahPertemuan;
      }, 0);

      res.status(200).json({
        success: true,
        message: "Total de sesiones obtenido exitosamente",
        pertemuan,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getJadwalSiswa = async (req, res, next) => {
  try {
    const kelasId = req.params.kelasId;
    const jadwal = await Jadwal.find({
      kelas: new mongoose.Types.ObjectId(kelasId),
    })
      .populate({ path: "guru", select: "nama" })
      .populate("bidangStudi")
      .sort({ mulai: 1 });

    const libur = await Libur.findOne();

    const kelas = await Kelas.findById(kelasId).select("-siswa");

    if (kelas && kelas.waliKelas) {
      await kelas.populate({ path: "waliKelas", select: "nama phone" });
    }

    const ajaran = await TahunAjaran.find({ status: true });

    res.status(200).json({
      success: true,
      message: "Horarios de clases obtenidos con éxito",
      jadwal,
      libur: libur.perpekan,
      nasional: libur.nasional,
      kelas,
      ajaran: ajaran[0].ajaran,
    });
  } catch (error) {
    next(error);
  }
};
