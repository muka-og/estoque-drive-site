import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === HABILITAR CORS ===
// Permite qualquer frontend se comunicar
app.use(cors());

// Se quiser restringir só para o seu GitHub Pages:
// app.use(cors({ origin: "https://SEU_USUARIO.github.io" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === MULTER CONFIG PARA UPLOAD DE FOTOS ===
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === ROTA DE TESTE RAPIDA ===
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend está online!" });
});

// === ROTA DE PEDIDO ===
app.post("/pedido", upload.array("fotos"), async (req, res) => {
  try {
    const { placa, cliente, telefone, descricao } = req.body;
    const fotos = req.files;

    // === GERAR CÓDIGO DE PEDIDO ===
    const codigoPedido = uuidv4().slice(0, 8).toUpperCase();

    // === SALVAR NO GOOGLE SHEET ===
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      codigoPedido,
      placa,
      cliente,
      telefone,
      descricao,
      data: new Date().toLocaleString(),
    });

    // === UPLOAD PARA GOOGLE DRIVE ===
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const driveService = google.drive({ version: "v3", auth });

    for (let file of fotos) {
      await driveService.files.create({
        requestBody: {
          name: `${placa}_${file.originalname}`,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
        media: {
          mimeType: file.mimetype,
          body: Buffer.from(file.buffer),
        },
      });
    }

    return res.json({ success: true, codigoPedido });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// === START SERVER ===
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
