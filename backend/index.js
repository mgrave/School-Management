import bcrypt, { hash, genSalt } from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { app } from "./src/app/app.js";
import Siswa from "./src/models/siswa-model.js";
import Kelas from "./src/models/kelas-model.js";
import Total from "./src/models/total-model.js";
import { fileURLToPath } from "url";

dotenv.config();

if (process.env.DOMAIN) {
  console.log('✅ Archivo de variables cargado:', process.env.DOMAIN);
} else {
  console.error('❌ Archivo de variables no encontrado');
}

const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;
const replicaApp = process.env.APP_NAME

// Función para hashear contraseñas
async function hashPassword(users) {
  console.log("[HASH] Iniciando hasheo de contraseñas para", users.length, "usuarios");
  for (const user of users) {
    if (user.password) {
      console.log("[HASH] Hasheando contraseña para el usuario:", user.nis);
      const salt = await genSalt();
      user.password = await hash(user.password, salt);
    }
  }
  console.log("[HASH] Hasheo de contraseñas completado");
  return users;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer datos JSON desde un archivo
const readJsonData = () => {
  const filePath = path.join(__dirname, "src/data", "siswa.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Función para agregar estudiantes en masa
const bulkAddSiswa = async () => {
  try {
    console.log("[BULK] Iniciando operación de inserción masiva");
    
    // Leer y hashear los datos
    const siswas = readJsonData();
    console.log("[BULK] Leídos", siswas.length, "estudiantes desde el archivo JSON");
    
    const hashedSiswas = await hashPassword(siswas);
    console.log("[BULK] Procesados", hashedSiswas.length, "registros hasheados");

    // Agrupar estudiantes por grado y nombre de clase
    const kelasUpdates = {};
    const siswaToInsert = [];
    const tahunMasukCounts = {};

    for (const siswa of hashedSiswas) {
      // Buscar la clase basada en el grado y el nombre de la clase
      const kelasSiswa = await Kelas.findOne({
        kelas: siswa.kelas,
        nama: siswa.namaKelas,
      });

      if (!kelasSiswa) {
        console.log(
          `Clase con grado: ${siswa.kelas} y nombre de clase: ${siswa.namaKelas} no encontrada`
        );
        continue;
      }

      // Agregar estudiante a la lista de inserción
      siswaToInsert.push({ ...siswa, kelas: kelasSiswa._id });

      // Actualizar kelasUpdates con el ID de la clase
      if (!kelasUpdates[kelasSiswa._id]) {
        kelasUpdates[kelasSiswa._id] = [];
      }
      kelasUpdates[kelasSiswa._id].push(null); // Marcador de posición para el ID del estudiante

      // Contar estudiantes por año de ingreso
      if (!tahunMasukCounts[siswa.tahunMasuk]) {
        tahunMasukCounts[siswa.tahunMasuk] = 0;
      }
      tahunMasukCounts[siswa.tahunMasuk]++;
    }

    console.log("[BULK] Preparando para insertar", siswaToInsert.length, "estudiantes");
    let insertedSiswas;
    if (siswaToInsert.length > 0) {
      insertedSiswas = await Siswa.insertMany(siswaToInsert);
      console.log("[BULK] Estudiantes insertados exitosamente:", insertedSiswas.length);
    }

    // Mapear los estudiantes insertados a sus IDs
    const siswaIdMap = insertedSiswas.reduce((map, siswa) => {
      map[siswa.kelas] = map[siswa.kelas] || [];
      map[siswa.kelas].push(siswa._id);
      return map;
    }, {});

    // Actualizar documentos de clase
    console.log("[BULK] Actualizando", Object.keys(kelasUpdates).length, "clases");
    for (const [kelasId, siswaIds] of Object.entries(kelasUpdates)) {
      console.log("[BULK] Procesando clase ID:", kelasId);
      const siswaList = siswaIdMap[kelasId] || [];

      await Kelas.findByIdAndUpdate(kelasId, {
        $push: { siswa: { $each: siswaList } },
        $set: {
          jumlahSiswa:
            siswaList.length + (await Kelas.findById(kelasId)).siswa.length,
        },
      });
    }

    // Actualizar la colección Total
    console.log("[BULK] Actualizando totales para", Object.keys(tahunMasukCounts).length, "años de ingreso");
    for (const [tahunMasuk, count] of Object.entries(tahunMasukCounts)) {
      console.log("[BULK] Año", tahunMasuk, "total:", count);
      await Total.findOneAndUpdate(
        { ajaran: tahunMasuk },
        {
          $inc: { totalSiswa: count },
        },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Datos agregados exitosamente en masa");
  } catch (error) {
    console.error("❌ Error al agregar estudiantes en masa:", error.message);
  }
};

// Conectar a MongoDB
const connectDB = async () => {
  try {
    console.log("⏳ Intentando conectar a MongoDB en:", databaseURL);
    await mongoose.connect(databaseURL);
    console.log("✅ Conectado a la base de datos");
    
    console.log("🔄 Verificando si es necesaria la inserción masiva");
    //await bulkAddSiswa();
  } catch (error) {
    console.log("❌ Error al conectar a la base de datos:", error);
  }
};

// Endpoint para verificar el estado de la API
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Status</title>
        <style>
          body {
            background: #1a1a1a;  /* Fondo oscuro */
            color: #ffffff;      /* Texto blanco */
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          h1 {
            color: #f8f9fa;      /* Blanco ligeramente más brillante */
            margin-bottom: 15px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          p {
            font-size: 1.2em;
            margin: 8px 0;
            color: #e9ecef;      /* Gris claro para mejor contraste */
          }
          strong {
            color: #4dabf7;      /* Azul claro para destacar */
          }
        </style>
        <script>
          function updateTime() {
            const date = new Date();
            const peTime = new Intl.DateTimeFormat('es-PE', {
              dateStyle: 'full',
              timeStyle: 'long',
              timeZone: 'America/Lima'
            }).format(date);
            document.getElementById("timestamp").textContent = peTime;
          }
          setInterval(updateTime, 1000);
        </script>
      </head>
      <body>
        <h1>API ${replicaApp} is running</h1>
        <p>Status: <strong>success</strong></p>
        <p>Timestamp: <strong id="timestamp">${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</strong></p>
      </body>
    </html>
  `);
});

app.listen(port, async () => {
  console.log(`🚀 Starting server initialization on ... ${replicaApp}`);
  console.log("🕒 Server time:", new Date().toISOString());
  await connectDB();
  console.log("🌐 Server is running on port", port);
  console.log("📊 Monitoring endpoints:");
  console.log(`   - http://localhost:${port}/ (status endpoint)`);
});
