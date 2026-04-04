import ResponseError from "../error/response-error.js";
import TahunAjaran from "../models/tahunAjaran-model.js";

export const addAjaran = async (req, res, next) => {
  try {
    const { ajaran } = req.body;

    const isExist = await TahunAjaran.findOne({ ajaran });

    if (isExist) {
      throw new ResponseError(400, "El mismo año académico ya existe");
    }

    if (!ajaran.includes("/")) {
      throw new ResponseError(400, "Formato de año académico no válido");
    }

    const [first, last] = ajaran.split("/");

    const firstYear = parseInt(first);
    const lastYear = parseInt(last);

    if (lastYear - firstYear === 1) {
      await TahunAjaran.updateMany({ status: false });

      const newAjaran = new TahunAjaran({ ajaran });

      await newAjaran.save();

      res.status(200).json({
        success: true,
        message: "Éxito al agregar el Año Académico.",
      });
    } else {
      throw new ResponseError(
        404,
        "Año no válido. Asegúrese de que la diferencia sea de solo 1 año."
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getAjaran = async (req, res, next) => {
  try {
    const ajaran = await TahunAjaran.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Éxito al obtener el Año Académico.",
      ajaran,
    });
  } catch (error) {
    next(error);
  }
};

export const getAjaranAktif = async (req, res, next) => {
  try {
    const ajaran = await TahunAjaran.findOne({ status: true });

    res.status(200).json({
      success: true,
      message: "Éxito al obtener el Año Académico.",
      ajaran,
    });
  } catch (error) {
    next(error);
  }
};

export const editAjaran = async (req, res, next) => {
  try {
    const id = req.params.id;

    const ajaran = await TahunAjaran.findById(id);

    if (!ajaran) {
      throw new ResponseError(404, "Año académico no encontrado.");
    }

    await TahunAjaran.updateMany({ status: false });

    await TahunAjaran.findByIdAndUpdate(id, { status: true });

    res.status(200).json({
      success: true,
      message: "Éxito al activar el Año Académico " + ajaran.ajaran,
      ajaran,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAjaran = async (req, res, next) => {
  try {
    const id = req.params.id;
    const totalAjaran = await TahunAjaran.countDocuments();

    if (totalAjaran === 1) {
      throw new ResponseError(
        404,
        "No se puede eliminar el año académico. Debe haber al menos 1 año activo."
      );
    }

    const ajaran = await TahunAjaran.findByIdAndDelete(id);

    if (!ajaran) {
      throw new ResponseError(404, "Año académico no encontrado");
    }

    if (ajaran.status) {
      const newActiveAjaran = await TahunAjaran.findOneAndUpdate(
        {},
        { status: true },
        { new: true, sort: { createdAt: 1 } }
      );

      if (!newActiveAjaran) {
        throw new ResponseError(
          500,
          "Error al activar otro año académico después de la eliminación."
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Éxito al eliminar el Año Académico " + ajaran.ajaran,
    });
  } catch (error) {
    next(error);
  }
};
