require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/upload", upload.array("fotos"), async (req, res) => {
  try {
    const { placa, cliente, telefone, descricao } = req.body;

    if (!placa || !cliente || !telefone) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ erro: "Nenhuma foto enviada" });
    }

    const codigo = uuidv4().slice(0, 8).toUpperCase();

    console.log("📦 NOVO PEDIDO");
    console.log("Placa:", placa);
    console.log("Cliente:", cliente);
    console.log("Telefone:", telefone);
    console.log("Fotos:", req.files.length);
    console.log("Código:", codigo);

    return res.json({
      sucesso: true,
      codigo
    });

  } catch (err) {
    console.error("ERRO SERVIDOR:", err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

app.listen(3333, () => {
  console.log("🚀 API rodando em http://localhost:3333");
});
