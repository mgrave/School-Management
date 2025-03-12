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

// Function to hash passwords
async function hashPassword(users) {
  console.log("[HASH] Starting password hashing for", users.length, "users");
  for (const user of users) {
    if (user.password) {
      console.log("[HASH] Hashing password for user:", user.nis);
      const salt = await genSalt();
      user.password = await hash(user.password, salt);
    }
  }
  console.log("[HASH] Completed password hashing");
  return users;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data from file
const readJsonData = () => {
  const filePath = path.join(__dirname, "src/data", "siswa.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Bulk add siswa function
const bulkAddSiswa = async () => {
  try {
    console.log("[BULK] Starting bulk insert operation");
    
    // Read and hash the data
    const siswas = readJsonData();
    console.log("[BULK] Read", siswas.length, "students from JSON file");
    
    const hashedSiswas = await hashPassword(siswas);
    console.log("[BULK] Processed", hashedSiswas.length, "hashed records");

    // Group siswa by kelas and namaKelas
    const kelasUpdates = {};
    const siswaToInsert = [];
    const tahunMasukCounts = {};

    for (const siswa of hashedSiswas) {
      // Find the Kelas based on kelas and namaKelas
      const kelasSiswa = await Kelas.findOne({
        kelas: siswa.kelas,
        nama: siswa.namaKelas,
      });

      if (!kelasSiswa) {
        console.log(
          `Kelas with kelas: ${siswa.kelas} and namaKelas: ${siswa.namaKelas} not found`
        );
        continue;
      }

      // Add siswa to the insert list
      siswaToInsert.push({ ...siswa, kelas: kelasSiswa._id });

      // Update kelasUpdates with the Kelas ID
      if (!kelasUpdates[kelasSiswa._id]) {
        kelasUpdates[kelasSiswa._id] = [];
      }
      kelasUpdates[kelasSiswa._id].push(null); // Placeholder for siswa _id

      // Count students by tahunMasuk
      if (!tahunMasukCounts[siswa.tahunMasuk]) {
        tahunMasukCounts[siswa.tahunMasuk] = 0;
      }
      tahunMasukCounts[siswa.tahunMasuk]++;
    }

    console.log("[BULK] Preparing to insert", siswaToInsert.length, "students");
    let insertedSiswas;
    if (siswaToInsert.length > 0) {
      insertedSiswas = await Siswa.insertMany(siswaToInsert);
      console.log("[BULK] Successfully inserted", insertedSiswas.length, "students");
    }

    // Map the inserted siswa to their _id
    const siswaIdMap = insertedSiswas.reduce((map, siswa) => {
      map[siswa.kelas] = map[siswa.kelas] || [];
      map[siswa.kelas].push(siswa._id);
      return map;
    }, {});

    // Update Kelas documents
    console.log("[BULK] Updating", Object.keys(kelasUpdates).length, "classes");
    for (const [kelasId, siswaIds] of Object.entries(kelasUpdates)) {
      console.log("[BULK] Processing class ID:", kelasId);
      const siswaList = siswaIdMap[kelasId] || [];

      await Kelas.findByIdAndUpdate(kelasId, {
        $push: { siswa: { $each: siswaList } },
        $set: {
          jumlahSiswa:
            siswaList.length + (await Kelas.findById(kelasId)).siswa.length,
        },
      });
    }

    // Update Total collection
    console.log("[BULK] Updating total counts for", Object.keys(tahunMasukCounts).length, "entry years");
    for (const [tahunMasuk, count] of Object.entries(tahunMasukCounts)) {
      console.log("[BULK] Year", tahunMasuk, "count:", count);
      await Total.findOneAndUpdate(
        { ajaran: tahunMasuk },
        {
          $inc: { totalSiswa: count },
        },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Bulk data added successfully");
  } catch (error) {
    console.error("❌ Failed to bulk add siswa:", error.message);
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("⏳ Attempting MongoDB connection to:", databaseURL);
    await mongoose.connect(databaseURL);
    console.log("✅ Connected to DB");
    
    console.log("🔄 Checking if bulk insert is needed");
    // await bulkAddSiswa();
  } catch (error) {
    console.log("❌ Failed to connect to DB:", error);
  }
};

// Endpoint to check API status
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
