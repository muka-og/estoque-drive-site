import { google } from "googleapis";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/drive"]
);

const drive = google.drive({ version: "v3", auth });

async function criarPasta(nome, parentId) {
  const res = await drive.files.create({
    requestBody: {
      name: nome,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId]
    },
    fields: "id"
  });

  return res.data.id;
}

async function buscarOuCriarPasta(nome, parentId) {
  const res = await drive.files.list({
    q: `name='${nome}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
    fields: "files(id, name)"
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  return criarPasta(nome, parentId);
}

export async function salvarNoDrive(files, data, placa) {
  if (!files || files.length === 0) {
    throw new Error("Nenhum arquivo enviado");
  }

  const pastaDataId = await buscarOuCriarPasta(
    data,
    process.env.DRIVE_ROOT_FOLDER
  );

  const pastaPlacaId = await buscarOuCriarPasta(
    placa,
    pastaDataId
  );

  for (const file of files) {
    await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [pastaPlacaId]
      },
      media: {
        mimeType: file.mimetype,
        body: Buffer.from(file.buffer)
      }
    });
  }
}
