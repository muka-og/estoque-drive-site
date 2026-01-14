import { salvarNoDrive } from "../services/driveService.js";
import { formatPlaca } from "../utils/formatPlaca.js";
import { dataHoje } from "../utils/formatData.js";

export async function uploadFotos(req, res) {
  try {
    const placa = formatPlaca(req.body.placa);
    const data = dataHoje();

    await salvarNoDrive(req.files, data, placa);

    res.json({ sucesso: true });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}
