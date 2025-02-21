import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`[Multer] Guardando archivo: ${file.originalname}`);
    cb(null, "src/uploads/file"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    const newFilename = Date.now().toString() + "-" + file.originalname;
    console.log(`[Multer] Nombre archivo generado: ${newFilename}`);
    cb(null, newFilename); // File name
  },
});

export const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(`[Multer] Filtro de archivo: ${file.mimetype}`);
    cb(null, true);
  }
}); 
