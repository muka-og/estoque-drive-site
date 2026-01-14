export function formatPlaca(placa) {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
